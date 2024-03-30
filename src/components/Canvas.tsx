import React, {useEffect, useState} from "react";
import Ball from "../tools/ball";
import Billiard from "../tools/billiard";
import Modal from "./Modal";

const Canvas = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    let balls = []
    let billiard: Billiard
    const modal = React.useRef<HTMLDivElement>(null)

    const onHide = () => {
        if(modal.current !== null){
            modal.current.style.display = "none"
        }
    }

    const changeColor = (ballId: number, color: string) => {
        billiard.changeBallColor(ballId, color)
        onHide()
    }

    const pickUpBall = (x: number, y: number, modal: HTMLDivElement) => {
        const touchedBall = billiard.takeTheBall(x, y)
        if(touchedBall > 0){
            localStorage.setItem("touchedId", touchedBall.toString())
            modal.style.display = "flex"
        }
    }

    setTimeout(() => {
        if(canvasRef.current !== null){
            balls = [
                new Ball(1,100, 100, 50, 'green'),
                new Ball(2,100, 450, 25, 'blue'),
                new Ball(3, 650, 150, 40, 'black'),
                new Ball(4, 300, 250, 25, 'red'),
                new Ball(5, 550, 500, 30, 'yellow')
            ]
            billiard = new Billiard(canvasRef.current, balls)
            start(billiard)
        }
    }, 0)

    const start = (billiard: Billiard) => {
        setInterval(() => {
            billiard.tick()
        }, 10)
    }

    return (
        <div className="canvas-wrapper">
            <div ref={modal} id="modal">
                <Modal
                    changeColor={changeColor}
                />
            </div>
            <canvas
                ref={canvasRef}
                id="canvas"
                width={800}
                height={600}
                onClick={(e) => {
                    if(modal.current !== null){
                        pickUpBall(e.pageX, e.pageY, modal.current)
                    }
                }}
            ></canvas>
        </div>
    );
};

export default Canvas;