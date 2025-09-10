import { Test, TestingModule } from '@nestjs/testing';
import { SajuController } from './saju.controller';
import { SajuService } from './saju.service';
import { Types } from 'mongoose';

describe('SajuController', () => {
  let controller: SajuController;
  let service: SajuService;

  const mockSajuService = {
    calculateSaju: jest.fn(),
    getSavedResults: jest.fn(),
    getRecentResults: jest.fn(),
    getSajuById: jest.fn(),
    saveResult: jest.fn(),
    saveBulkResults: jest.fn(),
    deleteResult: jest.fn(),
    cleanupTempResults: jest.fn(),
    searchAddress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SajuController],
      providers: [
        {
          provide: SajuService,
          useValue: mockSajuService,
        },
      ],
    }).compile();

    controller = module.get<SajuController>(SajuController);
    service = module.get<SajuService>(SajuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('calculateSaju', () => {
    it('should calculate saju with authenticated user', async () => {
      const mockDto = {
        name: '홍길동',
        gender: '남',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        calendarType: '양력',
        city: '서울',
        isTimeUnknown: false,
      };

      const mockResult = {
        _id: new Types.ObjectId(),
        ...mockDto,
        fourPillars: {},
      };

      mockSajuService.calculateSaju.mockResolvedValue(mockResult);

      const req = { user: { _id: 'userId123' } };
      const result = await controller.calculateSaju(req, mockDto);

      expect(mockSajuService.calculateSaju).toHaveBeenCalledWith(
        'userId123',
        mockDto,
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
    });

    it('should calculate saju without authenticated user', async () => {
      const mockDto = {
        name: '홍길동',
        gender: '남',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        calendarType: '양력',
        city: '서울',
        isTimeUnknown: false,
      };

      const mockResult = {
        _id: new Types.ObjectId(),
        ...mockDto,
      };

      mockSajuService.calculateSaju.mockResolvedValue(mockResult);

      const req = {};
      const result = await controller.calculateSaju(req, mockDto);

      expect(mockSajuService.calculateSaju).toHaveBeenCalledWith(null, mockDto);
      expect(result.success).toBe(true);
    });
  });

  describe('getRecentResults', () => {
    it('should get recent results with limit', async () => {
      const mockResults = [
        { _id: '1', name: 'test1' },
        { _id: '2', name: 'test2' },
      ];

      mockSajuService.getRecentResults.mockResolvedValue(mockResults);

      const req = { user: { _id: 'userId123' } };
      const result = await controller.getRecentResults(req, '10');

      expect(mockSajuService.getRecentResults).toHaveBeenCalledWith(
        'userId123',
        10,
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResults);
    });

    it('should use default limit when not provided', async () => {
      const mockResults = [{ _id: '1', name: 'test1' }];

      mockSajuService.getRecentResults.mockResolvedValue(mockResults);

      const req = {};
      const result = await controller.getRecentResults(req, undefined);

      expect(mockSajuService.getRecentResults).toHaveBeenCalledWith(null, 5);
      expect(result.success).toBe(true);
    });
  });

  describe('saveResult', () => {
    it('should save single result', async () => {
      const mockResult = {
        _id: new Types.ObjectId(),
        name: 'test',
      };

      mockSajuService.saveResult.mockResolvedValue(mockResult);

      const req = { user: { _id: 'userId123' } };
      const sajuId = new Types.ObjectId().toString();
      const result = await controller.saveResult(req, sajuId);

      expect(mockSajuService.saveResult).toHaveBeenCalledWith(
        'userId123',
        sajuId,
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('사주 결과가 저장되었습니다');
    });
  });

  describe('saveBulkResults', () => {
    it('should save multiple results', async () => {
      const mockResult = {
        modifiedCount: 3,
        matchedCount: 3,
      };

      mockSajuService.saveBulkResults.mockResolvedValue(mockResult);

      const req = { user: { _id: 'userId123' } };
      const body = {
        sajuIds: ['id1', 'id2', 'id3'],
      };

      const result = await controller.saveBulkResults(req, body);

      expect(mockSajuService.saveBulkResults).toHaveBeenCalledWith(
        'userId123',
        body.sajuIds,
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('3개의 사주 결과가 저장되었습니다');
    });
  });

  describe('cleanupTempResults', () => {
    it('should cleanup temporary results', async () => {
      const mockResult = {
        deletedCount: 10,
      };

      mockSajuService.cleanupTempResults.mockResolvedValue(mockResult);

      const result = await controller.cleanupTempResults();

      expect(mockSajuService.cleanupTempResults).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.message).toBe('10개의 임시 결과가 정리되었습니다');
    });
  });
});
