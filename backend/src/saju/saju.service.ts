import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SajuResult, SajuResultDocument } from './schemas/saju-result.schema';
import { CalculateSajuDto } from './dto/saju.dto';

@Injectable()
export class SajuService {
  constructor(
    @InjectModel(SajuResult.name) private sajuResultModel: Model<SajuResultDocument>,
  ) {}

  async calculateSaju(userId: string, calculateSajuDto: CalculateSajuDto) {
    // TODO: 실제 사주 계산 로직 구현
    // 현재는 더미 데이터 생성
    const fourPillars = this.generateDummyFourPillars();
    const interpretation = this.generateDummyInterpretation();

    const sajuResult = new this.sajuResultModel({
      userId: new Types.ObjectId(userId),
      ...calculateSajuDto,
      fourPillars,
      interpretation,
    });

    await sajuResult.save();
    return sajuResult;
  }

  async getSavedResults(userId: string) {
    return this.sajuResultModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSajuById(userId: string, sajuId: string) {
    return this.sajuResultModel
      .findOne({ 
        _id: new Types.ObjectId(sajuId), 
        userId: new Types.ObjectId(userId) 
      })
      .exec();
  }

  private generateDummyFourPillars() {
    const heavenlyStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const earthlyBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

    return {
      year: {
        heaven: heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)],
        earth: earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)],
      },
      month: {
        heaven: heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)],
        earth: earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)],
      },
      day: {
        heaven: heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)],
        earth: earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)],
      },
      time: {
        heaven: heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)],
        earth: earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)],
      },
    };
  }

  private generateDummyInterpretation() {
    const personalities = [
      '당신은 리더십이 강하고 창의적인 성격을 가지고 있습니다. 타고난 카리스마로 주변 사람들을 이끄는 능력이 있으며, 새로운 아이디어를 실현하는 데 탁월한 재능을 보입니다.',
      '차분하고 신중한 성격으로 모든 일을 꼼꼼히 계획하여 진행합니다. 안정을 추구하며, 주변 사람들에게 신뢰받는 든든한 존재입니다.',
      '활발하고 에너지가 넘치는 성격입니다. 새로운 도전을 즐기며, 긍정적인 마인드로 어떤 어려움도 극복해나갑니다.',
    ];

    const careers = [
      '경영, 기획, 창업 분야에서 큰 성공을 거둘 수 있습니다. 특히 혁신적인 아이디어가 필요한 분야에서 두각을 나타낼 것입니다.',
      '교육, 연구, 전문직 분야에서 뛰어난 성과를 보일 수 있습니다. 꾸준한 노력과 전문성으로 인정받게 될 것입니다.',
      '예술, 디자인, 엔터테인먼트 분야에서 재능을 발휘할 수 있습니다. 창의성을 바탕으로 많은 사람들에게 영감을 줄 것입니다.',
    ];

    const relationships = [
      '열정적이고 헌신적인 연애를 하는 타입입니다. 파트너와의 소통을 중요시하며, 서로를 존중하는 관계를 추구합니다.',
      '진실하고 깊이 있는 관계를 선호합니다. 한번 사랑하면 오래가는 편이며, 상대방을 위해 많은 것을 희생할 수 있습니다.',
      '자유롭고 개방적인 연애관을 가지고 있습니다. 상대방의 개성을 존중하며, 함께 성장해나가는 관계를 원합니다.',
    ];

    const fortunes = [
      '올해는 새로운 기회가 많이 찾아올 시기입니다. 과감한 도전이 좋은 결과를 가져올 수 있으니, 망설이지 말고 행동하세요.',
      '안정적인 발전이 기대되는 시기입니다. 꾸준한 노력을 통해 목표를 달성할 수 있으며, 주변의 도움도 많이 받을 것입니다.',
      '변화와 전환의 시기입니다. 새로운 환경이나 분야에 도전해볼 좋은 기회이니, 적극적으로 변화를 받아들이세요.',
    ];

    return {
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      career: careers[Math.floor(Math.random() * careers.length)],
      relationship: relationships[Math.floor(Math.random() * relationships.length)],
      fortune: fortunes[Math.floor(Math.random() * fortunes.length)],
    };
  }
}