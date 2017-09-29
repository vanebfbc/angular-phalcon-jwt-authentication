export interface ShowState {
	show: boolean;
}

export interface AlertState extends ShowState {
	subject : string;
	body : string;
	reauthorize : boolean;
}