import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Steps,
    Step,
    Select,
    Option,
    Radio,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Popover,
    MessageBox,
    Dialog,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Pagination,
    Tooltip,
    DatePicker,
    Upload,
    Alert,
    Tabs,
    TabPane,
    Collapse,
    CollapseItem,
    Transfer
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Select)
Vue.use(Option)
Vue.use(Radio)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Popover)
Vue.use(Dialog)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(DatePicker)
Vue.use(Upload)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Transfer)

Vue.prototype.$message = Message
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$confirm = MessageBox.confirm