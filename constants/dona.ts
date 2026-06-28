import Dona1Face1 from "@/assets/images/dona/dona1_1.svg";
import Dona1Face2 from "@/assets/images/dona/dona1_2.svg";
import Dona1Face3 from "@/assets/images/dona/dona1_3.svg";
import Dona1Face4 from "@/assets/images/dona/dona1_4.svg";
import Dona1Face5 from "@/assets/images/dona/dona1_5.svg";
import Dona2Face1 from "@/assets/images/dona/dona2_1.svg";
import Dona2Face2 from "@/assets/images/dona/dona2_2.svg";
import Dona2Face3 from "@/assets/images/dona/dona2_3.svg";
import Dona2Face4 from "@/assets/images/dona/dona2_4.svg";
import Dona2Face5 from "@/assets/images/dona/dona2_5.svg";
import Dona3Face1 from "@/assets/images/dona/dona3_1.svg";
import Dona3Face2 from "@/assets/images/dona/dona3_2.svg";
import Dona3Face3 from "@/assets/images/dona/dona3_3.svg";
import Dona3Face4 from "@/assets/images/dona/dona3_4.svg";
import Dona3Face5 from "@/assets/images/dona/dona3_5.svg";
import Dona4Face1 from "@/assets/images/dona/dona4_1.svg";
import Dona4Face2 from "@/assets/images/dona/dona4_2.svg";
import Dona4Face3 from "@/assets/images/dona/dona4_3.svg";
import Dona4Face4 from "@/assets/images/dona/dona4_4.svg";
import Dona4Face5 from "@/assets/images/dona/dona4_5.svg";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

export type DonaSkinVariant = 1 | 2 | 3 | 4;
export type DonaExpression = 1 | 2 | 3 | 4 | 5;

const DONA_IMAGES: Record<
  DonaSkinVariant,
  Record<DonaExpression, ComponentType<SvgProps>>
> = {
  1: {
    1: Dona1Face1,
    2: Dona1Face2,
    3: Dona1Face3,
    4: Dona1Face4,
    5: Dona1Face5,
  },
  2: {
    1: Dona2Face1,
    2: Dona2Face2,
    3: Dona2Face3,
    4: Dona2Face4,
    5: Dona2Face5,
  },
  3: {
    1: Dona3Face1,
    2: Dona3Face2,
    3: Dona3Face3,
    4: Dona3Face4,
    5: Dona3Face5,
  },
  4: {
    1: Dona4Face1,
    2: Dona4Face2,
    3: Dona4Face3,
    4: Dona4Face4,
    5: Dona4Face5,
  },
};

export const getDonaSvg = (
  skinVariant: DonaSkinVariant | undefined,
  expression: DonaExpression,
) => DONA_IMAGES[skinVariant ?? 1][expression];
