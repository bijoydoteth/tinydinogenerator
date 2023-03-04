export type selectedTraits = {
    traitName: string;
    traitValue: string;
    layer: number;
    userLocked: boolean;
} []

export type TraitSelectBoxProps = {
    selectedTraits: selectedTraits;
    setSelectedTraits: React.Dispatch<React.SetStateAction<selectedTraits>>;
}

export type TraitDisplayBoxProps = {
    selectedTraits: selectedTraits;
    imageURL: string;
}