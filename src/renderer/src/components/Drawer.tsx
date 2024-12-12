import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { StatusStore, useNetworkStore, useStatusStore } from '../store'
import { Registry } from '../../../resources/GlobalTypes'
import { sendMessage } from '@renderer/ipc'
import { SocketMostSendMessage } from 'socketmost/dist/modules/Messages'
import {
  Drawer,
  AppBar as MuiAppBar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  NotificationAdd as NotificationAddIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material'

const drawerWidth = 240

type OpenProp = {
  open: boolean
}

// @ts-ignore not sure why forwarding prop not forwarding to type
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<OpenProp>(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  })
)

// @ts-ignore not sure why forwarding prop not forwarding to type
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<OpenProp>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

const PersistentDrawerLeft: React.FC = () => {
  const theme = useTheme()
  const [
    open,
    setOpen,
    setFBlock,
    setFBlockModalOpen,
    toggleDeviceSubscription,
    subscribedDevices
  ] = useStatusStore((state: StatusStore) => [
    state.open,
    state.setOpen,
    state.setFBlock,
    state.setFBlockModalOpen,
    state.toggleDeviceSubscription,
    state.subscribedDevices,
  ])
  const registry: Registry = useNetworkStore((state) => state.registry)
  const handleDrawerClose = (): void => {
    setOpen(false)
  }

  const handleSubscription = (text2: any, text: string, isSubscribed: boolean): void => {
    const id = `${text}_${text2.address}_${text2.instanceID}`
  
    setFBlock(
      {
        targetAddress: text2.address,
        fBlock: text,
        instanceID: text2.instanceID,
        fBlockID: text2.fBlockID,
      },
      (fBlock) => {
        if (!fBlock) {
          console.error('no fBlock set');
          return;
        }

        const message: SocketMostSendMessage = {
          targetAddressHigh: fBlock.targetAddressHigh,
          targetAddressLow: fBlock.targetAddressLow,
          fBlockID: fBlock.fBlockID,
          instanceID: fBlock.instanceID,
          fktID: 0x001,
          opType: 0x00, // Set
          data: isSubscribed ? [0x02, 0x01, 0x10] : [0x00, 0x01, 0x10], // TODO: remove hardcoded pimost address?
        };

        sendMessage(message);
        toggleDeviceSubscription(id);
      },
    );
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />

      {Object.keys(registry).map((text, index) => (
        <List
          key={index}
          subheader={
            <ListSubheader component={'div'} id={text}>
              {text}
            </ListSubheader>
          }
        >
          {registry[text].map((text2) => {
            const id = `${text}_${text2.address}_${text2.instanceID}`
            const isSubscribed = subscribedDevices.includes(id)

            return (
              <ListItem key={id} disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={`Addr: 0x${text2.address.toString(16)} inst: 0x${text2.instanceID.toString(
                      16
                    )}`}
                    onClick={(): void => {
                      setFBlock({
                        targetAddress: text2.address,
                        fBlock: text,
                        instanceID: text2.instanceID,
                        fBlockID: text2.fBlockID
                      })
                      setOpen(false)
                      setFBlockModalOpen(true)
                    }}
                  />
                </ListItemButton>
                <IconButton
                  onClick={(): void => {
                    handleSubscription(text2, text, isSubscribed)
                  }}
                  // sx={{
                  //   color: isSubscribed ? 'green' : 'default',
                  // }}
                >
                  {isSubscribed ? <NotificationsOffIcon /> : <NotificationAddIcon />}
                </IconButton>
              </ListItem>
            )
          })}
        </List>
      ))}
    </Drawer>
  )
}

export default PersistentDrawerLeft
