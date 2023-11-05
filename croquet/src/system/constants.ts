import { Address } from "viem";

export const WINDOW_WIDTH = 800;
export const WINDOW_HEIGHT = 600;
export const ASPECT_RATIO = WINDOW_WIDTH / WINDOW_HEIGHT;
export const D = 70;
export const ISOMETRIC_ADJUSTED_PLANE = D * 6.5 * ASPECT_RATIO;
export const ROAD_WIDTH = 50;
export const LEFT_LANE = -(ROAD_WIDTH / 4);
export const RIGHT_LANE = ROAD_WIDTH / 4;
export const ROAD_LINE_SIZE = 15;
export const ROAD_LINE_SPACE = 5;
