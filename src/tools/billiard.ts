import Ball from "./ball";

export default class Billiard {
    balls: Ball[]
    canvas: HTMLCanvasElement
    ctx: any
    mouseDown = false
    inertia = 300
    offsetLeft = 0
    offsetTop = 0


    constructor(canvas: HTMLCanvasElement, balls: Ball[]) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.balls = balls
        this.listen()
    }


    listen(){
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e: any){
        this.mouseDown = false
    }
    mouseDownHandler(e: any){
        this.mouseDown = true
        this.offsetLeft = e.target.offsetLeft
        this.offsetTop = e.target.offsetTop
    }
    mouseMoveHandler(e: any){
        if(this.mouseDown){
            this.hitTheBall(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop, this.balls)
        }
    }

    takeTheBall(x: number, y: number){
        let a = 0
        x = x - this.offsetLeft
        y = y - this.offsetTop
        this.balls.map( ball => {
            const len = Math.sqrt(Math.pow( x - ball.x, 2) + Math.pow(y - ball.y, 2))
            if(len < ball.rad - 5){
                a =  ball.id
            }
        })
        return a
    }

    changeBallColor(id: number, color: string){
        this.balls.map(item => {
            if(item.id === id){
                item.color = color
            }
        })
    }

    hitTheBall(x: number, y: number, balls: Ball[]){
        balls.map( ball => {
            const len = Math.sqrt(Math.pow(x - ball.x, 2) + Math.pow(y - ball.y, 2))
            if(len < ball.rad && len > ball.rad - 5){
                this.rollTheBall(ball, x, y, this.inertia, balls, 0.5)
            }
        })
    }

    rollTheBall(ball: Ball, x: number, y: number, inertia: number, balls: Ball[], batterWeight: number){
        let signY = 1
        let signX = 1

        let a = Math.abs(ball.x - x)/20
        let b = Math.abs(ball.y - y)/20

        const swapX = () =>{
            signX*=-1
        }
        const swapY = () =>{
            signY*=-1
        }
        if(ball.x > x && ball.y > y){
            // console.log("Лево верх")
            signY = 1
            signX = 1
        } else if(ball.x > x && ball.y < y){
            // console.log("Лево низ")
            signY = -1
            signX = 1
        } else if(ball.x < x && ball.y > y){
            // console.log("Право верх")
            signY = 1
            signX = -1
        } else if(ball.x < x && ball.y < y){
            // console.log("Право низ")
            signY = -1
            signX = -1
        }
        const canvW = this.canvas.width
        const canvH = this.canvas.height

        const moveBall = (
            ball: Ball,
            a: number,
            b: number,
            canvW: number,
            canvH: number,
            timeLeft: number,
            swapX: Function,
            swapY: Function,
            balls: Ball[],
            batterWeight: number,
            clearTime: Function
        ) => {

            balls.filter(item => item.id !== ball.id).map(ballItem => {
                let len = Math.sqrt(Math.pow(ballItem.x - ball.x, 2) + Math.pow(ballItem.y - ball.y, 2))

                if(len < (ballItem.rad + ball.rad) && len > (ballItem.rad + ball.rad) - 3){

                    const k = ballItem.rad/(ballItem.rad + ball.rad)
                    const Xc = (1-k) * ballItem.x + k * ball.x
                    const Yc = (1-k) * ballItem.y + k * ball.y

                    this.rollTheBall(ballItem, Xc, Yc, timeLeft * ballItem.weight, balls, ball.weight)
                    clearTime()
                    this.rollTheBall(ball, Xc, Yc, timeLeft * ball.weight, balls, ballItem.weight)

                }
            })

            let k = 0


            ball.weight > batterWeight ? k = (timeLeft/ball.inertia) * ball.weight : k = (timeLeft/ball.inertia) * batterWeight

            a = a * k
            b = b * k

            if(ball.x + a > ball.rad && ball.x + a < canvW - ball.rad){ // если новое положение дальше от левой стенки чем радиус и если то же самое от правой стенки
                ball.x += a
            } else if (ball.x + a > canvW - ball.rad) { // если новое положение будет ближе чем на радиус к правой стенке
                swapX()
                ball.x = canvW - ball.rad
            }else if(ball.x + a < ball.rad){ // если новое положение будет ближе чем на радиус к правой стенке
                swapX()
                ball.x = ball.rad
            }
            if(ball.y + b > ball.rad && ball.y + b < canvH - ball.rad){
                ball.y += b
            } else if(ball.y + b > canvH - ball.rad) {
                swapY()
                ball.y = canvH - ball.rad
            } else if(ball.y + b < ball.rad){
                swapY()
                ball.y = ball.rad
            }
            return ball
        }

        let timeleft = inertia;
        const downloadTimer = setInterval(function(func){
            const clearTime = () => {
                timeleft = 0
            }
            if(timeleft <= 0){
                clearInterval(downloadTimer);
            }
            ball = func(ball, a * signX, b * signY, canvW, canvH, timeleft, swapX, swapY, balls, batterWeight, clearTime)
            timeleft -= 1;
        }, 1, moveBall);

    }

    tick(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.balls.map((ball) => {
            this.drawCircle(ball.x, ball.y, ball.rad, ball.color)
        })
    }

    drawCircle(x: number, y: number, rad: number, color: string){
        this.ctx.beginPath();
        this.ctx.arc(x, y, rad, 0, 360)
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}