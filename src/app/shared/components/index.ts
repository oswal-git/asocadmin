// Imports components
import { CardsUserComponent } from "./cards/cards-user/cards-user.component";
import { TitleH1Component } from "./titles/title-h1/title-h1.component";
import { EditorComponent } from "./editor/editor.component";
import { StepperComponent } from "./stepper/stepper.component";


export const components: any[] = [
    TitleH1Component,
    CardsUserComponent,
    EditorComponent,
    StepperComponent
];

// export all components
export * from "./titles/title-h1/title-h1.component";
export * from "./cards/cards-user/cards-user.component";
export * from "./editor/editor.component";
export * from "./stepper/stepper.component";

