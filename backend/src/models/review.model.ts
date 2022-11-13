import {Entity, model, property} from '@loopback/repository';

@model()
export class Review extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  rating: number;

  @property({
    type: 'date',
    required: true,
    default: new Date(),
  })
  datePosted: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',

  })
  userName: string;
  @property({
    type: 'string',

  })
  movieName: string;


  @property({
    type: 'string',
    required: true,
  })
  movieId: string;

  @property({
    type: 'boolean',

  })
  isActive?: boolean;


  constructor(data?: Partial<Review>) {
    super(data);
  }
}

export interface ReviewRelations {
  // describe navigational properties here
}

export type ReviewWithRelations = Review & ReviewRelations;
