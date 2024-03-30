export default class Ball {
    id: number
    rad: number
    x: number
    y: number
    color: string
    weight: number
    inertia = 300

    constructor(id: number,x: number, y: number, rad: number, color: string) {
        this.id = id
        this.rad = rad
        this.weight = rad * (-0.02) + 1.5
        this.x = x
        this.y = y
        this.color = color
    }
}