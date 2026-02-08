export interface IFavoriteDoctor {
  id: string;
  userId: string;
  doctorId: string;
  patientId: string;
  createdAt: Date;
}

export interface ICreateFavoriteDoctor {
  userId: string;
  doctorId: string;
  patientId: string;
}

export interface IUpdateFavoriteDoctor {
  userId?: string;
  doctorId?: string;
  patientId?: string;
}
