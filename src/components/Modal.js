import React from 'react';
import "../styles/colorWindow.css"

const Modal = ({changeColor}) => {

    const ballColors = [
        "green",
        "red",
        "black",
        "yellow",
        "blue",
        "orange",
        "skyblue",
    ]

    return (
        <div
            className="modal-container"
        >
            <div className="modal">
                <h1>Выберите цвет шара</h1>
                <div className="balls-wrapper">
                    {
                        ballColors.map(color =>
                            <div
                                onClick={() => {
                                    changeColor(Number(localStorage.getItem("touchedId")), color)
                                }}
                                key={color}
                                className="ball"
                                style={{background: color}}
                            ></div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Modal;