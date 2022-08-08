import { app } from "./app";

// export const listen = async (port: number) =>
//   await new Promise((resolve) => {
//     app.listen(port, () => {
//       console.log(`listening on port ${port}`);
//       return resolve(app);
//     });
//   });

export const createServer = (port: number) => app.listen(port);

export { app };
