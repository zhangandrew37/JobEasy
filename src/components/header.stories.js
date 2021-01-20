import React from "react"

import Header from "./header"
import { chakra } from "@chakra-ui/system"
import { VStack } from "@chakra-ui/react"

export default {
  title: "Components/Header",
  component: Header,
  decorators: [
    StoryFn => (
      <chakra.div>
        <StoryFn />
      </chakra.div>
    ),
  ],
}

export const Basic = args => <Header {...args} />
Basic.args = { siteTitle: "Title" }
