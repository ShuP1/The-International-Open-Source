import { remoteNeedsIndex } from 'international/constants'
import { RemoteDefender } from 'room/creeps/creepClasses'

RemoteDefender.prototype.preTickManager = function () {
    if (!this.memory.remote) return

    const role = this.role as 'remoteDefender'

    // If the creep's remote no longer is managed by its commune

    if (!Memory.rooms[this.commune].remotes.includes(this.memory.remote)) {

        // Delete it from memory and try to find a new one

        delete this.memory.remote
        if (!this.findRemote()) return
    }

    // Reduce remote need

    if (Memory.rooms[this.memory.remote].needs) {

        Memory.rooms[this.memory.remote].needs[remoteNeedsIndex.minDamage] -= this.attackStrength
        Memory.rooms[this.memory.remote].needs[remoteNeedsIndex.minHeal] -= this.healStrength
    }

    const commune = Game.rooms[this.commune]

    // Add the creep to creepsFromRoomWithRemote relative to its remote

    if (commune.creepsFromRoomWithRemote[this.memory.remote])
        commune.creepsFromRoomWithRemote[this.memory.remote][role].push(this.name)
}