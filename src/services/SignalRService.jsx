import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = "http://20.231.75.97:8090/";
} else {
  controller = "http://localhost:7015/";
}

export const serverMessages = async () => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(`${controller}notificationHub`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("alertaCampana", (message) => {
      // console.log("Recepcion: ", message);
    });






    

    await connection.start();
    await connection.invoke("SendMessage");
  } catch (error) {
    console.log(error);
  }
};
