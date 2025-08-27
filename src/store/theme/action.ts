import CreateAction from 'store/helpers/actions/actions';

const themeToggle = CreateAction<'light' | 'dark' | null>('Change Theme');

export default themeToggle;
