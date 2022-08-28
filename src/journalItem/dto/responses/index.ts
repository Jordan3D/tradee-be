import { IJournalItem } from 'src/interfaces/journalItem.interface';
import { INote } from 'src/interfaces/note.interface';

export class ResponseDto implements IJournalItem {
  
  id: string;

  title: string;

  content: string;

  authorId: string;

  tags: string[];

  notes: string[];

  pnls: string[];

  transactions: string[];
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: IJournalItem) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}