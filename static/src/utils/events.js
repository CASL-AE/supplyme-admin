export function formatRequestStatus(status) {
    switch (status) {
    case 0:
        return 'Created';
    case 1:
        return 'Submitted';
    case 2:
        return 'Funding Approved';
    case 3:
        return 'Funding Denied';
    case 4:
        return 'In Progress';
    case 5:
        return 'Shipped';
    case 6:
        return 'Delivered';
    case 7:
        return 'Completed';
    case 8:
        return 'Deleted';

    default:
        return 'Created';
    }
}

export function formatOrderStatus(status) {
    switch (status) {
    case 0:
        return 'Created';
    case 1:
        return 'Submitted';
    case 2:
        return 'Approved';
    case 3:
        return 'Denied';
    case 4:
        return 'In Progress';
    case 5:
        return 'Shipped';
    case 6:
        return 'Delivered';
    case 7:
        return 'Completed';
    case 8:
        return 'Deleted';

    default:
        return 'Created';
    }
}
