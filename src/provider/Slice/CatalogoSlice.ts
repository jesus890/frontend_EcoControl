import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListadoCatalogosI, CatalogoI } from '../../interfaces/interfaces.tsx';


const initialState: ListadoCatalogosI = {
  tiporesiduo_rsu : [],
  tipogenerador_su : [],
  destinofinal_rsu : [],
  
  transportistas_rme : [],
  tipotratamiento_rme : [],
  tiporesiduo_rme : [],

  agregacionmateria_rp: [],
  envases_rp: [],
  generadores_rp: [],
  destinofinal_rp: [],

};

const CatalogoSlice = createSlice({
  name: "catalogos",
  initialState,
  reducers: {
    setLlenarCatalogos: (state, action: PayloadAction<{ catalogo: keyof ListadoCatalogosI;  value: CatalogoI[] }>) => {
      state[action.payload.catalogo] = action.payload.value;
    },
  },
});

export const { setLlenarCatalogos } = CatalogoSlice.actions;
export default CatalogoSlice.reducer;
