import { IDiaryItem } from 'src/interfaces/diaryItem.interface';
import { IJournalItem } from 'src/interfaces/journalItem.interface';

export class ResponseDto implements IDiaryItem {
  
  id: string;

  title: string;

  content: string;

  authorId: string;

  tags: string[];
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: IDiaryItem) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}