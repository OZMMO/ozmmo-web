'use server';
export const createServer = async <T>(data: T) => {
  // Implement create logic

  console.log('create', {data});
  return { data }; // Return an ActionState object
}

export const updateServer = async <T>(data: T) => {
  // Implement update logic
  console.log('update', {data});
  return { data }; // Return an ActionState object
}

export const deleteServer = async <T>(data: T) => {
  // Implement delete logic
  console.log('delete', {data});
  return { data }; // Return an ActionState object
}