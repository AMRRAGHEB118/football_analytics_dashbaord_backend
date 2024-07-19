import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class TeamStatistics {
    
  @Prop({unique: true, required: true})
  id: number;
  
  @Prop({required: true})
  seasonId: number;
  
  @Prop({required: true})
  teamId: number;
  
  @Prop()
  details: [
    {
      id: number,
      team_statistic_id: number,
      type_id: number,
      values: object,
      type: {
        id: number,
        name: string,
        code: string,
        developer_name: string,
        model_type: string,
        stat_group: string
      }
    }
  ];

}