export type User = {
  id: string;
  name: string;
  email: string;
  passwd: string;
  friends: User[];
  enemies: User[];
};
