import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = "https://localhost:7015/notificationHub";
} else {
  controller = "https://localhost:7015/notificationHub";
}

export const serverMessages = async () => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(controller)
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("alertaCampana", (message) => {
      console.log("Recepcion: ", message);
    });

    await connection.start();
    await connection.invoke("SendMessage");
  } catch (error) {
    console.log(error);
  }
};
