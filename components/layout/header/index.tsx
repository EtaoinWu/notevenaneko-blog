import { FC, useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Container,
  Theme,
  Toolbar,
  MenuItem,
  Button,
  Stack,
  IconButton,
  MenuList,
  Collapse,
  ClickAwayListener,
} from '@mui/material';
import { Home, Inventory, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { throttle } from 'throttle-debounce';

export const AppHeader: FC = () => {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(() =>
    typeof window === 'object'
      ? document.getElementsByTagName('html')[0].scrollTop < 10
      : true
  );

  useEffect(() => {
    const onScroll = throttle(50, () => {
      setScroll(() => document.getElementsByTagName('html')[0].scrollTop < 10);
    });
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleOpenChange = useCallback(
    (value?: boolean) => () => {
      setOpen((open) =>
        value === undefined || value === null ? !open : value
      );
    },
    []
  );

  const NavList = useMemo(
    () => [
      {
        uri: '/',
        icon: <Home />,
        label: '首页',
      },
      {
        uri: '/archives',
        icon: <Inventory />,
        label: '归档',
      },
    ],
    []
  );

  const processNavList = useCallback(
    (disableInnerRipple?: boolean) =>
      NavList.map((item, index) => (
        <Link href={item.uri} key={index} passHref>
          <Button
            disableRipple={!!disableInnerRipple}
            startIcon={item.icon}
            sx={{
              color: 'primary.contrastText',
              '& .MuiButton-startIcon': {
                marginRight: 0.5,
              },
            }}
          >
            <Typography>{item.label}</Typography>
          </Button>
        </Link>
      )),
    [NavList]
  );

  return (
    <ClickAwayListener onClickAway={handleOpenChange(false)}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: (theme: Theme) => ({
            xs: !scroll
              ? theme.palette.primary.main
              : open
              ? theme.palette.primary.main
              : 'rgba(0, 0, 0, 0)',
            md: scroll ? 'rgba(0, 0, 0, 0)' : theme.palette.primary.main,
          }),
          transition: (theme: Theme) =>
            theme.transitions.create(['background-color'], {
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <Container
          sx={{
            maxWidth: (theme: Theme) => ({
              sm: theme.contentWidthScale * theme.breakpoints.values.sm,
              md: theme.contentWidthScale * theme.breakpoints.values.md,
              lg: theme.contentWidthScale * theme.breakpoints.values.lg,
            }),
            height: scroll ? '4rem' : '3.5rem',
            display: 'flex',
            alignItems: 'center',
            transition: (theme: Theme) =>
              theme.transitions.create(['height'], {
                duration: theme.transitions.duration.standard,
              }),
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', flexGrow: 1 }}>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              TEST
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: {
                  xs: 'none',
                  md: 'block',
                },
              }}
            >
              {processNavList()}
            </Stack>

            <Box
              sx={{
                display: {
                  xs: 'block',
                  md: 'none',
                },
              }}
            >
              <IconButton
                onClick={handleOpenChange()}
                sx={{
                  color: 'primary.contrastText',
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        <Collapse
          in={open}
          sx={{
            display: {
              xs: 'block',
              md: 'none',
            },
            width: '100vw',
          }}
        >
          <MenuList>
            {processNavList(true).map((item, index) => (
              <MenuItem
                key={index}
                sx={{
                  '& a': {
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  },
                }}
              >
                {item}
              </MenuItem>
            ))}
          </MenuList>
        </Collapse>
      </AppBar>
    </ClickAwayListener>
  );
};
