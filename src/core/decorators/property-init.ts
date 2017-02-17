export const viewModel = (target: Object, propertyKey: string | symbol) => {
    const viewModelKeys = '$__VIEW_MODEL_KEYS__';
    
    target[viewModelKeys] = target[viewModelKeys] || [];
    target[viewModelKeys].push(propertyKey);

}