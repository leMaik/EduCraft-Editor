import move_forward from './move_forward'
import turn from './turn'
import jump from './jump'
import if_block_ahead from './if_block_ahead'
import place_block from './place_block'
import place_block_ahead from './place_block_ahead'
import destroy_block from './destroy_block'
import place_torch from './place_torch'
import plant_crop from './plant_crop'
import shear from './shear'
import attack from './attack'

export default {
    move_forward: move_forward,
    turn: turn,
    jump: jump,

    if_block_ahead: if_block_ahead,

    place_block: place_block,
    place_block_ahead: place_block_ahead,
    destroy_block: destroy_block,
    place_torch: place_torch,
    plant_crop: plant_crop,
    shear: shear,
    attack: attack,
}