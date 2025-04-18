import React from "react";

export interface CatSpriteProps {
    id: string;
    className?: string;
    img: string;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const CatSprite: React.FC<CatSpriteProps> = ({
    id,
    className,
    img,
    onDragStart,
    onDragEnd,
}) => {
    return (
        <div
            id={id}
            className={className}
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            onDragEnd={onDragEnd}

        >
            <img src={img} alt="Sprite" width={100} height={100} />
        </div>
    );
};

export default CatSprite;
