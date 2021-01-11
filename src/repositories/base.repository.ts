
export interface BaseRepository {
    exists(t: number): Promise<boolean>;
    delete(t: number): Promise<any>;
    save(t: any): Promise<any>;
    findAll(): Promise<any>;
  }