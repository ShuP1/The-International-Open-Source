import { findObjectWithID } from "international/generalFunctions"
import { Builder } from "../creepClasses"

export function builderManager(room: Room, creepsOfRole: string[]) {

    // If there is no construction target ID

    if (!global[room.name].cSiteTargetID) {

        // Try to find a construction target. If none are found, stop

        if (!room.findCSiteTargetID(Game.creeps[creepsOfRole[0]])) return
    }

    // Convert the construction target ID into a game object

    let constructionTarget: ConstructionSite | false = findObjectWithID(global[room.name].cSiteTargetID)

    // If there is no construction target

    if (!constructionTarget) {

        // Try to find a construction target. If none are found, stop

        if (!room.findCSiteTargetID(Game.creeps[creepsOfRole[0]])) return
    }

    // Convert the construction target ID into a game object, stopping if it's undefined

    constructionTarget = findObjectWithID(global[room.name].cSiteTargetID)
    if (!constructionTarget) return

    // Loop through creep names of creeps of the manager's role

    for (const creepName of creepsOfRole) {

        // Get the creep using its name

        const creep: Builder = Game.creeps[creepName]

        // Try to build the construction target

        creep.advancedBuildCSite(constructionTarget)
    }
}
