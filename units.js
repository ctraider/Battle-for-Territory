// Unit class definition
class Unit {
    constructor(type, hp, dmg, arm, mv, cost, unlock, abilities = [], description = '') {
        this.type = type;
        this.hp = hp;
        this.dmg = dmg;
        this.arm = arm;
        this.mv = mv;
        this.cost = cost;
        this.unlock = unlock;
        this.abilities = abilities;
        this.description = description;
        
        // Validate unit properties
        this.validate();
    }

    validate() {
        if (this.hp <= 0) throw new Error(`Invalid HP for ${this.type}`);
        if (this.dmg < 0) throw new Error(`Invalid DMG for ${this.type}`);
        if (this.arm < 0) throw new Error(`Invalid ARM for ${this.type}`);
        if (this.mv <= 0) throw new Error(`Invalid MV for ${this.type}`);
        if (this.cost <= 0) throw new Error(`Invalid COST for ${this.type}`);
        if (this.unlock < 0) throw new Error(`Invalid UNLOCK for ${this.type}`);
    }

    // Calculate actual damage dealt to target
    calculateDamage(target) {
        return Math.max(1, this.dmg - target.arm);
    }

    // Check if unit can be unlocked with given territory count
    canUnlock(territoryCount) {
        return territoryCount >= this.unlock;
    }

    // Check if unit can be afforded with given resources
    canAfford(resources) {
        return resources >= this.cost;
    }
}

// Unit symbols/emojis
const UNIT_SYMBOLS = {
    KNIGHT: '🏇',
    SCOUT: '🔭',
    HEALER: '💖',
    MAGE: '🔮',
    TANK: '🛡️'
};

// Unit abilities
const ABILITIES = {
    TERRITORY_CAPTURE: 'territory_capture',
    AREA_CAPTURE: 'area_capture',
    HEAL: 'heal',
    BUFF: 'buff'
};

// Unit definitions matching documentation
const UNIT_DEFINITIONS = {
    KNIGHT: {
        type: 'KNIGHT',
        hp: 12,
        dmg: 5,
        arm: 3,
        mv: 2,
        cost: 5,
        unlock: 0,
        abilities: [ABILITIES.TERRITORY_CAPTURE],
        description: 'Базовая боевая единица с хорошим балансом характеристик'
    },
    SCOUT: {
        type: 'SCOUT',
        hp: 6,
        dmg: 2,
        arm: 1,
        mv: 4,
        cost: 1,
        unlock: 5,
        abilities: [ABILITIES.AREA_CAPTURE],
        area_capture_radius: 1,
        description: 'Быстрый юнит, способный захватывать большую территорию'
    },
    HEALER: {
        type: 'HEALER',
        hp: 10,
        dmg: 1,
        arm: 1,
        mv: 2,
        cost: 9,
        unlock: 10,
        abilities: [ABILITIES.HEAL],
        heal_amount: 2,
        heal_radius: 3,
        description: 'Поддерживающий юнит, способный исцелять союзников'
    },
    MAGE: {
        type: 'MAGE',
        hp: 8,
        dmg: 5,
        arm: 1,
        mv: 2,
        cost: 12,
        unlock: 15,
        abilities: [ABILITIES.BUFF],
        buff_target: 'TANK',
        buff_hp: 2,
        buff_arm: 2,
        description: 'Поддерживающий юнит, способный усиливать танков'
    },
    TANK: {
        type: 'TANK',
        hp: 20,
        dmg: 4,
        arm: 6,
        mv: 2,
        cost: 15,
        unlock: 20,
        abilities: [ABILITIES.TERRITORY_CAPTURE],
        description: 'Тяжелый юнит с высоким здоровьем и броней'
    }
};

// Create unit instances
const UNITS = Object.entries(UNIT_DEFINITIONS).reduce((acc, [key, def]) => {
    acc[key] = new Unit(
        def.type,
        def.hp,
        def.dmg,
        def.arm,
        def.mv,
        def.cost,
        def.unlock,
        def.abilities,
        def.description
    );
    return acc;
}, {});

// Export for use in other files
export {
    Unit,
    UNIT_SYMBOLS,
    ABILITIES,
    UNIT_DEFINITIONS,
    UNITS
}; 