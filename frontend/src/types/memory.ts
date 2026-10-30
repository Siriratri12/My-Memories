export interface Memory {
  id: number;
  title: string;
  description: string;
  memoryDate: string;
  userId?: number | null;
}

export interface MemoryInput {
  title: string;
  description: string;
  memoryDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
