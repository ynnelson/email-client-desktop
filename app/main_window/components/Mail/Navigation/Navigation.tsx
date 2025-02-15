/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// IMPORT EXTERNAL LIBRAIRIES
import { Button, IconButton, Dropdown, Icon, IconStack } from 'rsuite';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrop } from 'react-dnd';

// ICONS IMPORTS
import {
  EditSquare,
  Download,
  Edit,
  Send,
  Danger,
  Delete,
  Plus,
  ChevronDown,
  MoreSquare,
  MoreCircle,
  Bookmark
} from 'react-iconly';

// COMPONENT IMPORT
import NewFolderModal from '../NewFolderModal';

// CSS/LESS STYLES
import styles from './Navigation.less';

// INTERNATIONALIZATION
import i18n from '../../../../i18n/i18n';

// STATE SELECTORS
import {
  selectAllFoldersById,
  selectActiveMailbox
} from '../../../selectors/mail';

// REDUX ACTION CREATORS
import { folderSelection, createNewFolder } from '../../../actions/mail';

// TYPESCRIPT TYPES
import { StateType, FolderType } from '../../../reducers/types';

type Props = {
  isLoading?: boolean; // eslint-disable-line react/no-unused-prop-types
  newMessageAction: () => void;
  onRefreshData: () => void;
};

export default function Navigation(props: Props) {
  const mailbox = useSelector(selectActiveMailbox);
  const allFolders = useSelector(selectAllFoldersById);
  // const displayFolders = useSelector(selectDisplayFolders);
  // const history = useHistory();
  const dispatch = useDispatch();

  // Dictionary of Icon Components used in this function
  const CustomIcon = {
    inbox: Download,
    pencil: Edit,
    'send-o': Send,
    'trash-o': Delete,
    'folder-o': Bookmark,
    ban: Danger
  };

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [expandFolders, setExpandFolders] = useState(true);
  const [editFolder, setEditFolder] = useState(null);

  const activeFolderIndex = useSelector(
    (state: StateType) => state.globalState.activeFolderIndex
  );

  const foldersArray = useSelector(
    (state: StateType) => state.mail.folders.allIds
  );

  const selectFolder = async (index: string, e) => {
    if (
      (e &&
        !e.target.classList.contains('flex-initial') &&
        e.target.nodeName === 'svg') ||
      (e &&
        !e.target.classList.contains('flex-initial') &&
        e.target.nodeName === 'path') ||
      (e &&
        !e.target.classList.contains('flex-initial') &&
        e.target.nodeName === 'BUTTON')
    ) {
      return e.preventDefault();
    }

    if (index !== undefined) {
      const indx = parseInt(index);
      await dispatch(folderSelection(indx));
    }
  };

  const { newMessageAction, onRefreshData } = props;

  const handleNewFolder = () => {
    setEditFolder(null);
    setShowFolderModal(true);
  };

  const handleEditFolder = (folder: FolderType, e) => {
    e.stopPropagation();
    setEditFolder(folder);
    setShowFolderModal(true);
  };

  const handleDeleteFolder = (folder: FolderType, index: number, e) => {
    const _folder = { ...folder };
    _folder.index = index;
    e.stopPropagation();
    setEditFolder(_folder);
    setShowDeleteFolderModal(true);
  };

  const handleHideFolderModal = () => {
    setShowFolderModal(false);
    setShowDeleteFolderModal(false);
  };

  const handleCreateFolder = (folder: FolderType) => {
    dispatch(createNewFolder(folder));
  };

  const handleRefresh = async (isDelete: boolean, folderIndex: number) => {
    if (isDelete && activeFolderIndex === folderIndex) {
      await dispatch(folderSelection('0'));
    }

    onRefreshData();
  };

  const toggleFolders = () => {
    if (expandFolders) {
      setExpandFolders(false);
    } else {
      setExpandFolders(true);
    }
  };

  const MainFolders = ({ active, onSelect, folders, ...props }) => {
    return (
      <ul className="select-none">
        {folders.map((id, index) => {
          const folder = allFolders[id];

          if (
            folder.type === 'default' &&
            folder.name !== 'Screened' &&
            folder.name !== 'Reply Later'
          ) {
            const IconTag = CustomIcon[folder.icon];
            const [{ canDrop, isOver }, drop] = useDrop({
              accept: 'message',
              drop: () => ({ id: folder.id, name: folder.name }),
              collect: monitor => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
              })
            });

            const isDrop = canDrop && isOver;

            return (
              <li
                className={`flex relative px-2 my-0.5 mb-0 p-0.5 text-gray-500 items-center
                ${
                  active === index && !isDrop
                    ? 'text-gray-600 font-bold '
                    : 'hover:bg-gray-300 hover:bg-opacity-25 hover:text-gray-600'
                }
                ${
                  isDrop ? 'bg-gray-300 text-gray-500 hover:text-gray-600' : ' '
                }
                ${styles.navItem}`}
                key={folder.seq - 1}
                onClick={() => selectFolder(index)}
                ref={
                  folder.name !== 'Screened' &&
                  folder.name !== 'Sent' &&
                  folder.name !== 'Drafts'
                    ? drop
                    : null
                }
              >
                {/* <div
                  className={`${
                    active === index
                      ? 'rounded-r-lg bg-violet-400 w-1 h-full absolute left-0 top-0'
                      : ''
                  }`}
                /> */}
                <IconTag
                  className={`flex-initial ml-3 mb-1 ${
                    active === index && !isDrop ? 'text-purple-700' : ''
                  }`}
                  set={active === index && !isDrop ? 'bulk' : 'broken'}
                  size="small"
                />
                <span className="flex-auto pl-3 leading-loose align-middle text-sm self-center">
                  {folder.name}
                </span>
                {folder.name !== 'Sent' && folder.name !== 'Trash' && (
                  <div
                    className={`w-6 h-6 text-purple-700 font-semibold text-sm
                    flex-initial text-right leading-loose self-center flex items-center justify-center`}
                  >
                    {folder.count ? folder.count : ''}
                  </div>
                )}
              </li>
            );
          }
        })}

        <div className="group flex ml-2 mt-6" style={{ cursor: 'pointer' }}>
          {/* <div
            className="flex-none inline-block mr-4 text-gray-200"
            onClick={toggleFolders}
          >

          </div> */}
          <ChevronDown
            className={`mr-2 mb-0.5 text-gray-600 rounded hover:bg-gray-200 transition-transform ${
              expandFolders ? '' : 'transform -rotate-90 '
            }
              ${styles.chevron}`}
            onClick={toggleFolders}
            set="light"
            size="small"
          />
          <div
            className="flex-auto text-gray-600 flex-row flex self-center font-bold tracking-wider items-center text-sm uppercase"
            onClick={toggleFolders}
          >
            {i18n.t('mailbox.folders')}
          </div>
          <div className="group-hover:visible invisible flex-none mr-2 inline-block items-center flex hover:bg-gray-200 cursor-pointer text-gray-600 rounded p-1">
            {/* <Plus
              onClick={handleNewFolder}
              className="focus:outline-none justify-center items-center tracking-wide flex flex-row h-full"
              set="broken"
              size="small"
            /> */}
            <Icon
              icon="plus"
              onClick={handleNewFolder}
              className="focus:outline-none justify-center items-center tracking-wide flex flex-row h-full"
            />
          </div>
        </div>

        {folders.map((id, index) => {
          const folder = allFolders[id];

          if (folder.type === 'custom') {
            const [{ canDrop, isOver }, drop] = useDrop({
              accept: 'message',
              drop: () => ({ id: folder.id, name: folder.name }),
              collect: monitor => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
              })
            });

            const isDrop = canDrop && isOver;
            const IconTag = CustomIcon['folder-o'];
            return (
              <div
                key={folder.seq - 1}
                className={expandFolders ? 'show' : 'hide'}
              >
                <li
                  className={`group flex relative text-gray-500 pl-4 my-0.5 mb-0 p-0.5 items-center
                ${
                  active === index && !isDrop
                    ? 'text-gray-600 font-bold'
                    : 'hover:bg-gray-300 hover:bg-opacity-25 hover:text-gray-500'
                }
                ${
                  isDrop ? 'bg-gray-300 text-gray-500 hover:text-gray-600' : ' '
                }
                ${styles.navItem}`}
                  onClick={e => selectFolder(index, e)}
                  ref={drop}
                >
                  <IconTag
                    className={`flex-initial ml-1 mb-0.5 ${
                      active === index && !isDrop ? 'text-purple-700' : ''
                    }`}
                    set={active === index && !isDrop ? 'bulk' : 'broken'}
                    size="small"
                  />
                  <span className="flex-auto ml-2 leading-loose align-middle tracking-wide text-sm">
                    {folder.name}
                  </span>

                  <div className="opacity-0 group-hover:opacity-100 flex-none text-sm h-6">
                    <Dropdown
                      size="xs"
                      placement="bottomEnd"
                      renderTitle={() => {
                        return <MoreSquare set="broken" size="small" className="mt-0.5"/>;
                      }}
                    >
                      <Dropdown.Item onClick={e => handleEditFolder(folder, e)}>
                        <div className="flex text-sm">
                          <Edit set="broken" size="small" />
                          <span className="ml-2">{i18n.t('global.edit')}</span>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={e => handleDeleteFolder(folder, index, e)}
                      >
                        <div className="flex text-sm">
                          <Delete set="broken" size="small" />
                          <span className="ml-2">
                            {i18n.t('global.delete')}
                          </span>
                        </div>
                      </Dropdown.Item>
                    </Dropdown>
                  </div>

                  <span
                    className={`w-8 h-6 px-1 text-purple-700 font-semibold text-sm
                    flex-initial text-right leading-loose self-center flex items-center justify-center`}
                  >
                    {folder.count ? folder.count : ''}
                  </span>
                </li>
              </div>
            );
          }
        })}
        <div className={expandFolders ? 'show' : 'hide'}>
          <li
            className={`group flex relative text-gray-500 px-4 my-0.5 mb-0 p-0.5 items-center
               hover:bg-gray-300 hover:bg-opacity-25 hover:text-gray-500 ${styles.navItem}`}
            onClick={handleNewFolder}
          >
            <Plus
              className="flex-initial ml-1 text-trueGray-400"
              set="two-tone"
              size="small"
              filled
            />
            <span className="flex-auto ml-2 leading-loose align-middle tracking-wide text-sm">
              Add folder
            </span>
          </li>
        </div>
      </ul>
    );
  };

  return (
    <div className="flex w-full h-full ">
      <div className="flex-1">
        <div className="h-14 flex justify-center items-center">
          <Button
            appearance="primary"
            onClick={newMessageAction}
            block
            className="bg-gradient-to-tr from-purple-700 to-purple-500 rounded text-sm flex flex-row w-40 justify-center shadow active:shadow-sm"
          >
            <span>New Message</span>
            <EditSquare
              set="broken"
              className="text-white ml-4 mt-0.5"
              size="small"
            />
          </Button>
        </div>
        <Scrollbars style={{ height: '100%' }} hideTracksWhenNotNeeded autoHide>
          <div>
            <MainFolders
              appearance="subtle"
              reversed
              folders={foldersArray}
              active={activeFolderIndex}
              onSelect={selectFolder}
            />
          </div>
        </Scrollbars>
      </div>
      <NewFolderModal
        show={showFolderModal}
        showDelete={showDeleteFolderModal}
        hide={handleHideFolderModal}
        mailbox={mailbox}
        folder={editFolder}
        onCreateFolder={handleCreateFolder}
        folderCount={foldersArray.length}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

Navigation.defaultProps = {
  isLoading: false
};
