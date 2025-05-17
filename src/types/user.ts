export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  sid: string;           
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  hours: number;         
  points: number;        
  createdAt: string;     
  updatedAt: string;    
  isBanned: boolean; 
}
