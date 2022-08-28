import { myColors } from 'international/constants'
import { customLog, pack, packXY } from 'international/generalFunctions'
import { RoomManager } from '../roomManager'

export class EndTickCreepManager {
    roomManager: RoomManager
    room: Room

    constructor(roomManager: RoomManager) {
        this.roomManager = roomManager
        this.room = roomManager.room
    }

    public run() {

        if (!this.room.myCreepsAmount) return

        // If CPU logging is enabled, get the CPU used at the start

        if (Memory.CPULogging) var managerCPUStart = Game.cpu.getUsed()

        for (const role in this.room.myCreeps)
            for (const creepName of this.room.myCreeps[role]) {

                const creep = Game.creeps[creepName]

                creep.endTickManager()
                creep.recurseMoveRequest()
            }

        // If CPU logging is enabled, log the CPU used by this manager

        if (Memory.CPULogging)
            customLog('End Tick Creep Manager', (Game.cpu.getUsed() - managerCPUStart).toFixed(2), undefined, myColors.lightGrey)
    }
}
