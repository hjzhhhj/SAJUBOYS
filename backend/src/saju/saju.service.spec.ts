import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SajuService } from './saju.service';
import { SajuResult } from './schemas/saju-result.schema';
import { Types } from 'mongoose';

describe('SajuService', () => {
  let service: SajuService;
  let mockSajuResultModel: any;

  beforeEach(async () => {
    mockSajuResultModel = jest.fn();
    mockSajuResultModel.find = jest.fn();
    mockSajuResultModel.findOne = jest.fn();
    mockSajuResultModel.updateMany = jest.fn();
    mockSajuResultModel.deleteMany = jest.fn();
    mockSajuResultModel.deleteOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SajuService,
        {
          provide: getModelToken(SajuResult.name),
          useValue: mockSajuResultModel,
        },
      ],
    }).compile();

    service = module.get<SajuService>(SajuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateSaju', () => {
    it('should calculate and save saju result', async () => {
      const mockDto = {
        name: '홍길동',
        gender: '남',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        calendarType: '양력',
        city: '서울',
        isTimeUnknown: false,
      };

      const mockSajuResult = {
        ...mockDto,
        fourPillars: {
          year: { heaven: '경', earth: '오' },
          month: { heaven: '무', earth: '자' },
          day: { heaven: '갑', earth: '인' },
          time: { heaven: '경', earth: '오' },
        },
        save: jest.fn().mockResolvedValue(true),
      };

      mockSajuResultModel.mockReturnValue(mockSajuResult);

      const validUserId = new Types.ObjectId().toString();
      const result = await service.calculateSaju(validUserId, mockDto);

      expect(mockSajuResult.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should save even without userId', async () => {
      const mockDto = {
        name: '홍길동',
        gender: '남',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        calendarType: '양력',
        city: '서울',
        isTimeUnknown: false,
      };

      const mockSajuResult = {
        ...mockDto,
        save: jest.fn().mockResolvedValue(true),
      };

      mockSajuResultModel.mockReturnValue(mockSajuResult);

      const result = await service.calculateSaju(null, mockDto);

      expect(mockSajuResult.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('saveResult', () => {
    it('should update userId for existing result', async () => {
      const mockResult = {
        _id: new Types.ObjectId(),
        userId: null,
        save: jest.fn().mockResolvedValue(true),
      };

      mockSajuResultModel.findOne = jest.fn().mockResolvedValue(mockResult);

      const sajuId = mockResult._id.toString();
      const userId = new Types.ObjectId().toString();

      await service.saveResult(userId, sajuId);

      expect(mockSajuResultModel.findOne).toHaveBeenCalled();
      expect(mockResult.userId!.toString()).toBe(userId);
      expect(mockResult.save).toHaveBeenCalled();
    });

    it('should throw error if result not found', async () => {
      mockSajuResultModel.findOne = jest.fn().mockResolvedValue(null);

      const validObjectId = new Types.ObjectId().toString();
      await expect(service.saveResult('userId', validObjectId)).rejects.toThrow(
        '결과를 찾을 수 없습니다.',
      );
    });

    it('should throw error if result belongs to another user', async () => {
      const existingUserId = new Types.ObjectId();
      const mockResult = {
        _id: new Types.ObjectId(),
        userId: existingUserId,
      };

      mockSajuResultModel.findOne = jest.fn().mockResolvedValue(mockResult);

      const differentUserId = new Types.ObjectId().toString();

      await expect(
        service.saveResult(differentUserId, mockResult._id.toString()),
      ).rejects.toThrow('다른 사용자의 결과입니다.');
    });
  });

  describe('getRecentResults', () => {
    it('should return recent results for authenticated user', async () => {
      const userId = new Types.ObjectId().toString();
      const mockResults = [
        { _id: '1', name: 'test1' },
        { _id: '2', name: 'test2' },
      ];

      const findMock = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockResults),
      };

      mockSajuResultModel.find = jest.fn().mockReturnValue(findMock);

      const results = await service.getRecentResults(userId, 5);

      expect(mockSajuResultModel.find).toHaveBeenCalledWith({
        $or: [{ userId: new Types.ObjectId(userId) }, { userId: null }],
      });
      expect(findMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(findMock.limit).toHaveBeenCalledWith(5);
      expect(results).toEqual(mockResults);
    });

    it('should return only null userId results for unauthenticated user', async () => {
      const mockResults = [{ _id: '1', name: 'test1' }];

      const findMock = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockResults),
      };

      mockSajuResultModel.find = jest.fn().mockReturnValue(findMock);

      const results = await service.getRecentResults(null, 3);

      expect(mockSajuResultModel.find).toHaveBeenCalledWith({
        userId: null,
      });
      expect(findMock.limit).toHaveBeenCalledWith(3);
      expect(results).toEqual(mockResults);
    });
  });

  describe('saveBulkResults', () => {
    it('should update multiple results at once', async () => {
      const userId = new Types.ObjectId().toString();
      const sajuIds = [
        new Types.ObjectId().toString(),
        new Types.ObjectId().toString(),
      ];

      mockSajuResultModel.updateMany = jest.fn().mockResolvedValue({
        modifiedCount: 2,
        matchedCount: 2,
      });

      const result = await service.saveBulkResults(userId, sajuIds);

      expect(mockSajuResultModel.updateMany).toHaveBeenCalled();
      expect(result.modifiedCount).toBe(2);
      expect(result.matchedCount).toBe(2);
    });
  });

  describe('cleanupTempResults', () => {
    it('should delete old temporary results', async () => {
      mockSajuResultModel.deleteMany = jest.fn().mockResolvedValue({
        deletedCount: 5,
      });

      await service.cleanupTempResults();

      expect(mockSajuResultModel.deleteMany).toHaveBeenCalled();
      const callArgs = mockSajuResultModel.deleteMany.mock.calls[0][0];
      expect(callArgs.userId).toBeNull();
      expect(callArgs.createdAt.$lt).toBeInstanceOf(Date);
    });
  });
});
