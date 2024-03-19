'use client';

export type FileModel = {
  _id: string;
  name: string;
  byte_size: number;
  extension: string | null;
  md5: string;
  path: string;
};
