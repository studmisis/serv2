export interface CreateTask {
  title: string;
  description: string;
  userId: number;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  completed?: boolean;
}
