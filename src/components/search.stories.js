import React, { useEffect, useState } from "react"

import Search from "./search"
import { chakra } from "@chakra-ui/system"
import { Box, Spinner } from "@chakra-ui/react"

export default {
  title: "Components/Search",
  component: Search,
  decorators: [
    StoryFn => (
      <chakra.div>
        <StoryFn />
      </chakra.div>
    ),
  ],
}

export const Default = args => <Search {...args} />
