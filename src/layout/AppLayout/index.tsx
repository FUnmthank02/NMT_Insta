import { Drawer, Layout, Menu, MenuProps, Modal, theme } from "antd";
import { useEffect, useState } from "react";
import {
  BarsOutlined,
  HeartOutlined,
  HomeOutlined,
  InstagramOutlined,
  LogoutOutlined,
  MessageOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Image, { StaticImageData } from "next/image";
import defaultAvt from "@/assets/images/defaultAvatar.jpg";
import logo from "@/assets/images/logo.png";
import SearchComponent from "@/components/search";
import NotificationComponent from "@/components/notification";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { ROUTE_PATH } from "@/utilities/enums";
import { useRouter } from "next/router";
import { SignInServices } from "@/services/auth/signIn";
import { RootState } from "@/redux/store";
import { UserServices } from "@/services/user";
import { getLocalStorage, getSpaceBodyAppLayout } from "@/utilities/helper";
import CreatePost from "@/components/createPost";
import STORAGE from "@/utilities/storage";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: string | React.ReactNode | StaticImageData,
  onClick?: () => void | null,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    onClick,
    children,
    label,
  } as MenuItem;
}

export const AppLayout = ({ children }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [curWidth, setCurWidth] = useState(window.innerWidth);
  const user = useSelector((state: RootState) => state.auth.user);
  const stateEditProfile = useSelector((state: RootState) => state.editProfile);
  const [IsSelecting, setIsSelecting] = useState(true);

  useEffect(() => {
    const handleWindowResize = () => {
      setCurWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }

    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = () => {
    const userId = getLocalStorage(STORAGE.userId);
    UserServices.getSingleUserProcess(dispatch, userId);
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isResetSeach, setResetSeach] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [isModalCreatePostOpen, setIsModalCreatePostOpen] = useState(false);

  const showDrawerSearch = () => {
    setOpenSearch(true);
  };
  
  const onCloseSearch = () => {
    setResetSeach(true);
    setOpenSearch(false);
  };

  const showDrawerNotify = () => {
    setOpenNotify(true);
  };
  
  const onCloseNotify = () => {
    setOpenNotify(false);
  };

  const showModalCreatePost = () => {
    setIsModalCreatePostOpen(true);
    setIsSelecting(true);
  };

  const handleCancelModalCreatePost = () => {
    setIsModalCreatePostOpen(false);
    setIsSelecting(true);
  };
  
  const handleLogOut = () => {
    SignInServices.logOutProcess(dispatch);
  };
  
  const handleRedirect = (route: string) => {
    router.push(route);
  };
  
  const items: MenuItem[] = [
    getItem('Home', '1', <HomeOutlined style={{fontSize: '25px', color: '#000'}}/>, () => handleRedirect(ROUTE_PATH.home)),
    getItem('Search', '2', <SearchOutlined style={{fontSize: '25px'}}/>, showDrawerSearch),
    getItem('Messages', '3', <MessageOutlined style={{fontSize: '25px', color: '#000'}}/>, () => handleRedirect(ROUTE_PATH.message)),
    getItem('Notifications', '4', <HeartOutlined style={{fontSize: '25px', color: '#000'}}/>, showDrawerNotify),
    getItem('Create', '5', <PlusSquareOutlined style={{fontSize: '25px', color: '#000'}}/>, showModalCreatePost),
    getItem('Profile', '6', <Image src={user?.avatar || defaultAvt.src} alt="Profile Avatar" priority width={25} height={25} style={{borderRadius: '50%'}}/>, () => handleRedirect(`${ROUTE_PATH.personalUser}/${user?.username}`)),
  ];
  
  const secondItems: MenuItem[] = [
    getItem('More', '1', <BarsOutlined style={{fontSize: '25px'}}/>, undefined, [
      getItem('Settings', '2', <SettingOutlined style={{fontSize: '17px'}}/>, () => handleRedirect(ROUTE_PATH.editProfile)),
      getItem('Log out', '3', <LogoutOutlined style={{fontSize: '17px'}}/>, handleLogOut),
    ]),
  ];
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {
        curWidth > 600 &&
        <Sider collapsed={collapsed} width={"270px"} style={{ background: colorBgContainer, position: "fixed", height: "100vh", padding: "3vh 0 7vh", borderRight: "1px solid #ccc" }}>
          <div className="wrap-logo-sider">
            {
              curWidth <= 768 ?
              <Link href={ROUTE_PATH.home}><InstagramOutlined style={{fontSize: '25px', color: "#000"}}/></Link>
              :
              <Image src={logo} priority alt="logo"/>
            }
          </div>
          <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} triggerSubMenuAction="click"/>
          <Menu theme="light" mode="inline" items={secondItems} triggerSubMenuAction="click" expandIcon={null}/>
        </Sider>
      }
      <Layout>
        {
          curWidth <= 600 &&
          <Header style={{ padding: "0 20px 0 10px", background: colorBgContainer, width: "100%", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ccc", position: "fixed", zIndex: 10000}} >
            <div><Image src={logo} priority alt="logo"/></div>
            <div><SearchOutlined className="mb-link-nav" onClick={showDrawerSearch} style={{fontSize: '25px', color: '#000'}}/></div>
          </Header>

        }
        <Content style={{marginLeft: getSpaceBodyAppLayout(curWidth), overflow: "hidden"}}>
          <div style={{ padding: curWidth > 600 ? 24 : "80px 7px 7px 7px", minHeight: curWidth > 600 ? "100vh" : "90vh", background: colorBgContainer }}>
            {children}
          </div>
        </Content>
        {
          curWidth <= 600 &&
          <Footer style={{ position: 'fixed', bottom: 0, width: "100%", zIndex: 2000 }}>
            <div style={{display: "flex", alignItems: 'center', justifyContent: 'space-around'}}>
              <Link className="mb-link-nav" href={ROUTE_PATH.home}><HomeOutlined style={{fontSize: '25px', color: '#000'}}/></Link>
              <Link className="mb-link-nav" href={ROUTE_PATH.message}><MessageOutlined style={{fontSize: '25px', color: '#000'}}/></Link>
              <span className="mb-link-nav"><HeartOutlined style={{fontSize: '25px', color: '#000'}} onClick={showDrawerNotify}/></span>
              <span className="mb-link-nav"><PlusSquareOutlined style={{fontSize: '25px', color: '#000'}} onClick={showModalCreatePost}/></span>
              <Link className="mb-link-nav" href={`${ROUTE_PATH.personalUser}/${user?.username}`}><Image src={defaultAvt.src} alt="Profile Avatar" width={25} height={25} style={{borderRadius: '50%'}}/></Link>
            </div>
          </Footer>
        }
      </Layout>
          <Drawer title="Search" placement="right" onClose={onCloseSearch} open={openSearch} zIndex={10001}>
            <SearchComponent closeSearch={onCloseSearch} isResetSeach={isResetSeach}/>
          </Drawer>
          <Drawer title="Notifications" placement="right" onClose={onCloseNotify} open={openNotify} width={400} zIndex={10001}>
            <NotificationComponent closeNotify={onCloseNotify}/>
          </Drawer>
          <Modal open={isModalCreatePostOpen} onCancel={handleCancelModalCreatePost} 
            title={<div className="custom-modal-title-create-post">Create new post</div>}
            footer={null} width={900} style={{top: 50}} closeIcon={null}>
              <CreatePost IsSelecting={IsSelecting} toggleSelecting={() => setIsSelecting(false)} closeModalCreate={handleCancelModalCreatePost}/>
          </Modal>
    </Layout>
  );
};
