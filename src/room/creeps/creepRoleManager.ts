import './creepFunctions'

import { creepRoles, myColors } from 'international/constants'
import { customLog } from 'international/generalFunctions'
import { Maintainer } from './roleManagers/commune/maintainer'
import { Builder } from './roleManagers/commune/builder'
import { Hauler } from './roleManagers/commune/hauler'
import { RemoteHauler } from './roleManagers/remote/remoteHauler'
import { Claimer } from './roleManagers/international/claimer'
import { AllyVanguard } from './roleManagers/international/allyVanguard'
import { HubHauler } from './roleManagers/commune/hubHaulerManager'
import { ControllerUpgrader } from './roleManagers/commune/controllerUpgrader'
import { SourceHarvester } from './roleManagers/commune/sourceHarvester'
import { MineralHarvester } from './roleManagers/commune/mineralHarvester'
import { FastFiller } from './roleManagers/commune/fastFiller'
import { MeleeDefender } from './roleManagers/commune/meleeDefender'
import { RemoteHarvester } from './roleManagers/remote/remoteHarvesterFunctions'
import { RemoteReserver } from './roleManagers/remote/remoteReserver'
import { RemoteDefender } from './roleManagers/remote/remoteDefender'
import { RemoteCoreAttacker } from './roleManagers/remote/remoteCoreAttacker'
import { RemoteDismantler } from './roleManagers/remote/remoteDismantler'
import { Scout } from './roleManagers/international/scout'
import { Vanguard } from './roleManagers/international/vanguard'
import { AntifaAssaulter } from './roleManagers/antifa/antifaAssaulter'
import { VanguardDefender } from './roleManagers/international/vanguardDefender'
import { CommuneManager } from 'room/communeManager'
import { RoomManager } from 'room/roomManager'

// Construct managers

const managers: Record<CreepRoles, Function> = {
    source1Harvester: SourceHarvester.sourceHarvesterManager,
    source2Harvester: SourceHarvester.sourceHarvesterManager,
    hauler: Hauler.haulerManager,
    controllerUpgrader: ControllerUpgrader.controllerUpgraderManager,
    builder: Builder.builderManager,
    maintainer: Maintainer.maintainerManager,
    mineralHarvester: MineralHarvester.mineralHarvesterManager,
    hubHauler: HubHauler.hubHaulerManager,
    fastFiller: FastFiller.fastFillerManager,
    meleeDefender: MeleeDefender.meleeDefenderManager,
    source1RemoteHarvester: RemoteHarvester.source1RemoteHarvesterManager,
    source2RemoteHarvester: RemoteHarvester.source2RemoteHarvesterManager,
    remoteHauler: RemoteHauler.remoteHaulerManager,
    remoteReserver: RemoteReserver.remoteReserverManager,
    remoteDefender: RemoteDefender.remoteDefenderManager,
    remoteCoreAttacker: RemoteCoreAttacker.remoteCoreAttackerManager,
    remoteDismantler: RemoteDismantler.remoteDismantlerManager,
    scout: Scout.scoutManager,
    claimer: Claimer.claimerManager,
    vanguard: Vanguard.vanguardManager,
    vanguardDefender: VanguardDefender.vanguardDefenderManager,
    allyVanguard: AllyVanguard.allyVanguardManager,
    antifaAssaulter: AntifaAssaulter.antifaAssaulterManager,
}

export class CreepRoleManager {
    roomManager: RoomManager
    room: Room

    constructor(roomManager: RoomManager) {
        this.roomManager = roomManager
        this.room = roomManager.room
    }

    public run() {
        // If CPU logging is enabled, get the CPU used at the start

        if (Memory.CPULogging) var managerCPUStart = Game.cpu.getUsed()

        for (const role of creepRoles) this.runManager(role)

        // If CPU logging is enabled, log the CPU used by this manager

        if (Memory.CPULogging)
            customLog(
                'Role Manager',
                `CPU: ${(Game.cpu.getUsed() - managerCPUStart).toFixed(2)}, CPU Per Creep: ${(this.room.myCreepsAmount
                    ? (Game.cpu.getUsed() - managerCPUStart) / this.room.myCreepsAmount
                    : 0
                ).toFixed(2)}`,
                undefined,
                myColors.lightGrey,
            )
    }

    private runManager(role: CreepRoles) {
        const roleCPUStart = Game.cpu.getUsed()

        // Get the amount of creeps with the role

        const creepsOfRoleAmount = this.room.myCreeps[role].length

        // If there are no creeps for this manager, iterate

        if (!this.room.myCreeps[role].length) return

        // Run manager

        try {
            managers[role](this.room, this.room.myCreeps[role])
        } catch (err) {
            customLog(
                'Exception processing creep role: ' + role + ' in ' + this.room.name + '. ',
                err + '\n' + (err as any).stack,
                myColors.white,
                myColors.red,
            )
        }

        // Log role stats

        customLog(
            `${role}s`,
            `Creeps: ${creepsOfRoleAmount}, CPU: ${(Game.cpu.getUsed() - roleCPUStart).toFixed(2)}, CPU Per Creep: ${(
                (Game.cpu.getUsed() - roleCPUStart) /
                creepsOfRoleAmount
            ).toFixed(2)}`,
            undefined,
        )
    }
}
