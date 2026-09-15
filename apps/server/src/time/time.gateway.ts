import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from "@nestjs/websockets";
import { TimeService } from "./time.service";
import { Server, Socket } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";
import {
  alreadyParticipants,
  CounterStatus,
  counterStatusMsg,
  currentParticipantTimes,
  CurrentTimes,
  resetCurrent,
  type SaveTime,
  type ResetTime,
} from "@cronope/schemas";

// el namespace es el ropm donde solo se conectan esos 2 clientes
// @AllowAnonymous()

@WebSocketGateway({
  cors: { origin: ["http://localhost:5173"], credentials: true },
  namespace: "competition-time",
})
export class TimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly timeService: TimeService) {}

  @WebSocketServer()
  private server!: Server;

  private countersStatus: Record<string, CounterStatus> = {}; // estado de conexion de los contadores
  private sendCounterStatus = (competitionId: string) =>
    this.server.to(competitionId).emit(counterStatusMsg, this.countersStatus[competitionId]);

  private alreadyParticipants: Record<string, string[]> = {};
  private sendAlreadyParticipants = (competitionId: string) =>
    this.server
      .to(competitionId)
      .emit(alreadyParticipants, this.alreadyParticipants[competitionId]);

  private currentTimes: Record<string, CurrentTimes> = {};
  private sendCurrentParticipantTimes = (competitionId: string) =>
    this.server.to(competitionId).emit(currentParticipantTimes, this.currentTimes[competitionId]);

  // _________________________________________ conexion
  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const competitionId = client.handshake.auth.competitionId;
    if (!token || !competitionId) return client.disconnect();

    const data = await this.timeService.validateUser(token, competitionId);
    if (!data) return client.disconnect();

    const { order, total, alias } = data;
    client.data.competitionId = competitionId;
    client.data.order = order;
    client.data.alias = alias;

    if (!this.alreadyParticipants[competitionId]) this.alreadyParticipants[competitionId] = [];

    if (!this.countersStatus[competitionId])
      this.countersStatus[competitionId] = Array(total).fill({ status: false, alias: "" });
    this.countersStatus[competitionId][order - 1] = { status: true, alias };

    if (!this.currentTimes[competitionId]) this.currentTimes[competitionId] = {};

    client.join(competitionId);
    this.sendCounterStatus(competitionId);
    if (this.alreadyParticipants[competitionId]) this.sendAlreadyParticipants(competitionId);
    if (this.currentTimes[competitionId]) this.sendCurrentParticipantTimes(competitionId);
  }

  // _________________________________________ desconexion
  handleDisconnect(client: Socket) {
    const competitionId = client.data.competitionId;
    const order = client.data.order;
    if (competitionId && order && this.countersStatus[competitionId]) {
      this.countersStatus[competitionId][order - 1] = { status: false, alias: "" };
      this.sendCounterStatus(competitionId);
    }
  }

  // _________________________________________ Lista de competidores
  @SubscribeMessage(alreadyParticipants)
  receiveAlreadyParticipants(
    @MessageBody() competitorId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const competitionId = client.data.competitionId as string;
    if (competitionId) {
      this.alreadyParticipants[competitionId].push(competitorId);
      this.currentTimes[competitionId][competitorId] = [];

      this.sendAlreadyParticipants(competitionId);
      this.sendCurrentParticipantTimes(competitionId);
    }
  }

  // _________________________________________ tiempo actual
  @SubscribeMessage(currentParticipantTimes)
  receiveTimeParticipant(
    @MessageBody() { participantId, time }: SaveTime,
    @ConnectedSocket() client: Socket,
  ) {
    const competitionId = client.data.competitionId;
    const order = client.data.order;
    if (competitionId) {
      if (!this.currentTimes[competitionId]) this.currentTimes[competitionId] = {};
      if (!this.currentTimes[competitionId][participantId])
        this.currentTimes[competitionId][participantId] = [];

      this.currentTimes[competitionId][participantId][order - 1] = time;
      this.sendCurrentParticipantTimes(competitionId);
    }
  }

  // _________________________________________ resetear actual
  @SubscribeMessage(resetCurrent)
  resetTimeParticipant(
    @MessageBody() { participantId, reset }: ResetTime,
    @ConnectedSocket() client: Socket,
  ) {
    const competitionId = client.data.competitionId as string;
    if (competitionId) {
      if (reset) {
        delete this.currentTimes[competitionId][participantId];
      } else {
        this.currentTimes[competitionId][participantId] = [];
      }

      console.log(this.currentTimes[competitionId]);
      this.sendCurrentParticipantTimes(competitionId);
    }
  }
}

// 1. Obtener el estatus de conexion de todos

/**
 * Se conecta el usuario al gateway, se valida session
 * Se busca si hay una competencia activa para el usuario
 *    No hay
 *      Se retorna null
 *    Hay
 *      Se retorna la competencia activa
 * Si no hay competencia activa, se retorna null y la page del usuario queda con un mensaje
 * Si hay compe
 *
 *
 */

/*
  EL usuario padre, selecciona una categoria y confirma con un boton de generar, no puede cambiar de categoria hasta que todos los tiempos hayan sido registrados, esto registra la categoria en todos los contadores

  Se actualiza la lista (objeto) de competidores, se muestra la card por cada competidor

  Se registran los tiempos por competidor en cada card, cuando se vayan completando los tiempos el contador maestro los guarda en la base de datos y este id se guarda en already para que se eliminen de la lista, 

  



*/
