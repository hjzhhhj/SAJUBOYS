import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SajuResultDocument = SajuResult & Document;

@Schema({ _id: false })
class Pillar {
  @Prop({ required: true })
  heaven: string;

  @Prop({ required: true })
  earth: string;
}

@Schema({ _id: false })
class FourPillars {
  @Prop({ type: Pillar, required: true })
  year: Pillar;

  @Prop({ type: Pillar, required: true })
  month: Pillar;

  @Prop({ type: Pillar, required: true })
  day: Pillar;

  @Prop({ type: Pillar, required: true })
  time: Pillar;
}

@Schema({ _id: false })
class AdvancedAnalysis {
  @Prop({ type: Object })
  zodiac: any;

  @Prop()
  daeunAnalysis: string;

  @Prop()
  specialPattern: string;

  @Prop()
  tenGodsAnalysis: string;

  @Prop({ type: Object })
  timelyFortune: any;
}

@Schema({ _id: false })
class Interpretation {
  @Prop({ required: true })
  personality: string;

  @Prop({ required: true })
  career: string;

  @Prop({ required: true })
  relationship: string;

  @Prop({ required: true })
  fortune: string;

  @Prop()
  wealth: string;

  @Prop()
  health: string;

  @Prop()
  elementBalance: string;

  @Prop()
  yinYangBalance: string;

  @Prop({ type: AdvancedAnalysis })
  advancedAnalysis: AdvancedAnalysis;
}

@Schema({ _id: false })
class DaeunItem {
  @Prop({ required: true })
  age: number;

  @Prop({ type: Pillar, required: true })
  pillar: Pillar;
}

@Schema({ timestamps: true })
export class SajuResult {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  birthDate: string;

  @Prop({ required: true })
  birthTime: string;

  @Prop({ required: true })
  calendarType: string;

  @Prop({ required: true })
  city: string;

  @Prop({ type: FourPillars, required: true })
  fourPillars: FourPillars;

  @Prop({ type: Interpretation, required: true })
  interpretation: Interpretation;

  @Prop({ type: [DaeunItem] })
  daeun: DaeunItem[];

  @Prop({ type: Pillar })
  saeun: Pillar;

  @Prop()
  solarTerm: string;

  @Prop({ type: Object })
  elements: { [key: string]: number };

  @Prop({ type: Object })
  yinYang: { yin: number; yang: number };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SajuResultSchema = SchemaFactory.createForClass(SajuResult);