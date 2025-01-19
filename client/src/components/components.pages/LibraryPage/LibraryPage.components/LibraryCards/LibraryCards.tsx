import { CollectionCard } from "@/components/components.common/CollectionCard";
import { Grid } from "@mui/material";
import { useUnit } from "effector-react";
import { FC } from "react";
import { libraryModel } from "../../LibraryPage.model/page-model";

export const LibraryCards: FC = () => {
    const [cards, removeCollection] = useUnit([libraryModel.$cards, libraryModel.removeCollection]);

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {cards.map((card, index) => (
                <Grid item key={index} xs={4}>
                    <CollectionCard
                        onRemove={removeCollection}
                        title={card.title}
                        cardAmount={card.cards.length}
                        author={card.author}
                        _id={card._id}
                        description={card.description} />
                </Grid>
            ))}
        </Grid>
    )
}