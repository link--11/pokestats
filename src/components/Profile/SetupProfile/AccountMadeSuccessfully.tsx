import { Heading, Stack, Text, Fade, Button, Link } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export const AccountMadeSuccessfully = () => {
  return (
    <Stack
      padding='1.5rem'
      spacing={10}
      justifyContent='space-between'
      height='100%'
    >
      <Heading color='gray.700'>Account setup completed</Heading>
      <Text size='2xl'>Redirecting you to your profile...</Text>
      <div></div>
    </Stack>
  );
};
