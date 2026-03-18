import Momo from "../assets/images/logos/momo.png"
import Sepay from "../assets/images/logos/seapay.png"
import ZaloPay from "../assets/images/logos/zalopay.png"

const PaymentLogo = ({ src, alt }) => (
    <img
        src={src}
        alt={alt}
        style={{
            width: '30px',
            height: '30px',
            objectFit: 'contain',
            borderRadius: '4px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
    />
);

const PAYMENT_METHODS = [
    {
        name: "Momo",
        image: <PaymentLogo src={Momo} alt="Momo" />
    },
    {
        name: "Sepay",
        image: <PaymentLogo src={Sepay} alt="Sepay" />
    },
    {
        name: "ZaloPay",
        image: <PaymentLogo src={ZaloPay} alt="ZaloPay" />
    },
]

const ROLE_ACCOUNT = ["user", "admin"]

const STATUS_BILL = [
    'Pending',
    'WaitingPayment',
    'Paid',
    'Failed',
    'Cancelled',
    'Expired',
]

const URL_IMAGE = "https://images.ygoprodeck.com/images/cards_small/"
const STATUS_TOURNAMENT = [
    {
        name: "Tất cả",
        key: "ALL",
        color: ""
    },
    {
        name: "Đã hoàn thành",
        key: "COMPLETED",
        color: "#4CAF50"
    },
    {
        name: "Đang diễn ra",
        key: "INPROGRESS",
        color: "#2196F3"
    },
    {
        name: "Dự kiến",
        key: "COMING",
        color: "#FF9800"
    },
    {
        name: "Đã hủy",
        key: "CANCELLED",
        color: "#F44336"
    }
]

const TYPE_TOURNAMENTS = [
    {
        name: "Tất cả",
        key: "ALL"
    },
    {
        name: "Server",
        key: "SERVER"
    },
    {
        name: "Local",
        key: "LOCAL"
    },
]

const BACKGROUND_CARDS = [
    {
        type: "Monster",
        monsterType: "Normal",
        background: "radial-gradient(circle at top left, #F7D58A, #C9A24D)",
    },
    {
        type: "Monster",
        monsterType: "Effect",
        background: "radial-gradient(circle at top left, #F3A55A, #C96B2C)",
    },
    {
        type: "Monster",
        monsterType: "Ritual",
        background: "radial-gradient(circle at top left, #7FB3E6, #2F6DB3)",
    },
    {
        type: "Monster",
        monsterType: "Fusion",
        background: "radial-gradient(circle at top left, #C28BD9, #6B2C91)"
    },
    {
        type: "Monster",
        monsterType: "Synchro",
        background: "radial-gradient(circle at top left, #F5F5F5, #9E9E9E)"
    },
    {
        type: "Monster",
        monsterType: "Xyz",
        background: "radial-gradient(circle at top left, #555555, #000000)"
    },
    {
        type: "Monster",
        monsterType: "Pendulum",
        background: "linear-gradient(135deg, #2E8B57, #D2B48C)"
    },
    {
        type: "Monster",
        monsterType: "Link",
        background: "radial-gradient(circle at top left, #1E90FF, #0B3C6D)"
    },
    {
        type: "Spell",
        background: "radial-gradient(circle at top left, #4CAF91, #1E7F6F)"
    },
    {
        type: "Trap",
        background: "radial-gradient(circle at top left, #C94B9A, #7A1F5C)"
    }
]


export {
    PAYMENT_METHODS,
    STATUS_BILL,
    ROLE_ACCOUNT,
    URL_IMAGE,
    STATUS_TOURNAMENT,
    TYPE_TOURNAMENTS,
    BACKGROUND_CARDS,
}