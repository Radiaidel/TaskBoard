import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private storageKey = 'categories';

  getCategories(): string[] {
    const storedCategories = localStorage.getItem(this.storageKey);
    return storedCategories ? JSON.parse(storedCategories) : [];
  }

  saveCategories(categories: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(categories));
  }

  addCategory(categories: string[], categoryName: string): { success: boolean, message: string, color: string } {
    if (!categoryName.trim()) {
      return { success: false, message: 'Le nom de la catégorie ne peut pas être vide.', color: 'bg-red-500' };
    }
    if (categories.includes(categoryName)) {
      return { success: false, message: 'Cette catégorie existe déjà.', color: 'bg-yellow-400' };
    }
    categories.push(categoryName);
    this.saveCategories(categories);
    return { success: true, message: 'Catégorie ajoutée avec succès !', color: 'bg-green-500' };
  }

  deleteCategory(categories: string[], index: number): { success: boolean, message: string, color: string }  {
    categories.splice(index, 1);
    this.saveCategories(categories);
    return { success: true, message: 'Catégorie supprimée avec succès !', color: 'bg-green-500' };
  }

  updateCategory(categories: string[], index: number, newName: string): { success: boolean, message: string, color: string } {
    if (!newName.trim()) {
      return { success: false, message: 'Le nom de la catégorie ne peut pas être vide.', color: 'bg-red-500' };
    }
    if (categories.includes(newName)) {
      return { success: false, message: 'Cette catégorie existe déjà.', color: 'bg-yellow-400' };
    }
    categories[index] = newName;
    this.saveCategories(categories);
    return { success: true, message: 'Catégorie mise à jour avec succès !', color: 'bg-green-500' };
  }
}
