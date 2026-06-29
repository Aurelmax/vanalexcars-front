import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Notification from './Notification.jsx';
import { compressImages } from '../../lib/utils/imageCompression';
import { buildApiUrl } from '../../lib/api';

interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  location: string;
  status: string;
  is_featured: boolean;
  is_new: boolean;
  slug: string;
  images?: Array<{
    id: string;
    url: string;
    alt: string;
    isMain: boolean;
  }>;
  imageUrls?: Array<{ url: string }>;
  processedImages?: {
    hero?: string;
    card?: string;
    thumbnail?: string;
    social?: string;
  };
  // Champs virtuels ajoutés par le hook backend
  mainImage?: string | null;
  galleryImages?: string[];
  brand?: string;
  model?: string;
  externalReference?: string;
  sourcePlatform?: string;
  lastScrapedAt?: string;
  specifications?: {
    engine: string;
    power: string;
    consumption: string;
    acceleration: string;
    color: string;
    interior: string;
  };
  features?: Array<{ feature: string }>;
  description?: string;
  contact_info?: {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
  };
  seo?: {
    meta_title: string;
    meta_description: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface VehicleManagerProps {
  onVehicleUpdate?: () => void;
}

export default function VehicleManager({
  onVehicleUpdate,
}: VehicleManagerProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // Formulaire de véhicule
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    title: '',
    price: 0,
    year: new Date().getFullYear(),
    mileage: 0,
    fuel: 'petrol',
    transmission: 'manual',
    location: '',
    status: 'active',
    is_featured: false,
    is_new: false,
    slug: '',
    description: '',
    specifications: {
      engine: '',
      power: '',
      consumption: '',
      acceleration: '',
      color: '',
      interior: '',
    },
    features: [],
    contact_info: {
      contact_name: '',
      contact_phone: '',
      contact_email: '',
    },
    seo: {
      meta_title: '',
      meta_description: '',
    },
  });

  // Charger les véhicules
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      // Appeler directement le backend Payload CMS
      const apiUrl = buildApiUrl('/api/vehicles?limit=100');
      console.log('🔍 Fetching vehicles from:', apiUrl);
      console.log('🌍 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

      const response = await fetch(apiUrl);
      console.log('📡 Response status:', response.status);

      const data = await response.json();

      if (data.docs) {
        // Payload retourne les données dans data.docs
        setVehicles(data.docs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Filtrer et trier les véhicules
  const filteredVehicles = vehicles
    .filter(vehicle => {
      const matchesSearch =
        vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Vehicle];
      const bValue = b[sortBy as keyof Vehicle];

      if (aValue === undefined || bValue === undefined) return 0;

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Gestion des images avec drag & drop et compression
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingImages(true);
    setNotification({
      type: 'info',
      message: 'Compression des images en cours...',
    });

    try {
      // Compresser les images avant l'upload
      const compressedFiles = await compressImages(acceptedFiles, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        maxSizeMB: 2,
      });

      // Calculer la réduction de taille
      const originalSize = acceptedFiles.reduce((sum: number, file: File) => sum + file.size, 0);
      const compressedSize = compressedFiles.reduce((sum: number, file: File) => sum + file.size, 0);
      const reduction = Math.round(((originalSize - compressedSize) / originalSize) * 100);

      setNotification({
        type: 'info',
        message: `Images compressées (-${reduction}%). Upload en cours...`,
      });

      const formData = new FormData();
      compressedFiles.forEach((file: File) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Ajouter les nouvelles images au véhicule sélectionné
        type UploadedImage = {
          id: string;
          url: string;
          alt?: string;
        };

        const newImages = (result.data as UploadedImage[]).map((file) => ({
          id: file.id,
          url: file.url,
          alt: file.alt || '',
          isMain: false,
        }));

        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...newImages],
        }));

        setNotification({
          type: 'success',
          message: `${newImages.length} image(s) uploadée(s) avec succès !`,
        });
      } else {
        setNotification({
          type: 'error',
          message: "Erreur lors de l'upload des images",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du traitement des images',
      });
    } finally {
      setUploadingImages(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
  });

  // Sauvegarder le véhicule
  const saveVehicle = async () => {
    setSaving(true);

    try {
      const url = isCreating
        ? buildApiUrl('/api/vehicles')
        : buildApiUrl(`/api/vehicles/${selectedVehicle?.id}`);

      const method = isCreating ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Vérifier le status HTTP plutôt que result.success
      // Payload retourne 200/201 en cas de succès
      if (response.ok) {
        await fetchVehicles();
        resetForm();
        onVehicleUpdate?.();
        setNotification({
          type: 'success',
          message: isCreating
            ? 'Véhicule créé avec succès !'
            : 'Véhicule mis à jour avec succès !',
        });
      } else {
        console.error('Erreur backend:', result);
        setNotification({
          type: 'error',
          message: result.message || 'Erreur lors de la sauvegarde du véhicule',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  // Supprimer un véhicule
  const deleteVehicle = async (vehicleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;

    try {
      const response = await fetch(buildApiUrl(`/api/vehicles/${vehicleId}`), {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchVehicles();
        onVehicleUpdate?.();
        setNotification({
          type: 'success',
          message: 'Véhicule supprimé avec succès !',
        });
      } else {
        setNotification({
          type: 'error',
          message: 'Erreur lors de la suppression du véhicule',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      price: 0,
      year: new Date().getFullYear(),
      mileage: 0,
      fuel: 'petrol',
      transmission: 'manual',
      location: '',
      status: 'active',
      is_featured: false,
      is_new: false,
      slug: '',
      description: '',
      specifications: {
        engine: '',
        power: '',
        consumption: '',
        acceleration: '',
        color: '',
        interior: '',
      },
      features: [],
      contact_info: {
        contact_name: '',
        contact_phone: '',
        contact_email: '',
      },
      seo: {
        meta_title: '',
        meta_description: '',
      },
    });
    setSelectedVehicle(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  // Éditer un véhicule
  const editVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData(vehicle);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Créer un nouveau véhicule
  const createVehicle = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
  };

  // Ajouter une fonctionnalité
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { feature: '' }],
    }));
  };

  // Supprimer une fonctionnalité
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index),
    }));
  };

  // Mettre à jour une fonctionnalité
  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) =>
        i === index ? { ...feature, feature: value } : feature
      ),
    }));
  };

  // Définir l'image principale
  const setMainImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.map(img => ({
        ...img,
        isMain: img.id === imageId,
      })),
    }));
  };

  // Supprimer une image
  const removeImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img.id !== imageId),
    }));
  };

  // Traiter les images avec Remove.bg + Studio
  const processImages = async () => {
    if (!selectedVehicle || !selectedVehicle.imageUrls || selectedVehicle.imageUrls.length === 0) {
      setNotification({
        type: 'error',
        message: 'Aucune image URL disponible pour le traitement',
      });
      return;
    }

    setProcessingImages(true);
    setNotification({
      type: 'info',
      message: 'Traitement des images en cours (Remove.bg + Studio + Upload Payload)...',
    });

    try {
      const response = await fetch('/api/process-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          imageUrls: selectedVehicle.imageUrls.map(img => img.url),
          vehicleInfo: {
            title: selectedVehicle.title,
            brand: selectedVehicle.brand,
            model: selectedVehicle.model,
            year: selectedVehicle.year,
            price: selectedVehicle.price,
            reference: selectedVehicle.externalReference,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Rafraîchir la liste et recharger le véhicule (l'API a déjà mis à jour le backend)
        await fetchVehicles();

        const updatedVehicleResponse = await fetch(
          buildApiUrl(`/api/vehicles/${selectedVehicle.id}`)
        );
        if (updatedVehicleResponse.ok) {
          const updatedVehicle = await updatedVehicleResponse.json();
          setSelectedVehicle(updatedVehicle);
          setFormData({
            ...updatedVehicle,
            images: updatedVehicle.images || [],
            imageUrls: updatedVehicle.imageUrls || [],
            features: updatedVehicle.features || [],
          });
        }

        if (result.uploadErrors && result.uploadErrors.length > 0) {
          setNotification({
            type: 'warning',
            message: `Images traitées avec ${result.uploadErrors.length} erreur(s) d'upload: ${result.uploadErrors.join(', ')}`,
          });
        } else {
          setNotification({
            type: 'success',
            message: 'Images traitées, uploadées sur Payload et sauvegardées avec succès!',
          });
        }
      } else {
        setNotification({
          type: 'error',
          message: result.error || 'Erreur lors du traitement des images',
        });
      }
    } catch (error) {
      console.error('Erreur traitement images:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du traitement des images',
      });
    } finally {
      setProcessingImages(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Header avec actions */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Gestion des Véhicules
          </h2>
          <p className='text-gray-600'>
            {filteredVehicles.length} véhicule(s) trouvé(s)
          </p>
        </div>
        <button
          onClick={createVehicle}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          <span>Nouveau véhicule</span>
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className='bg-white p-4 rounded-lg shadow-sm border'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Recherche
            </label>
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Titre, localisation...'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>Tous</option>
              <option value='active'>Disponible</option>
              <option value='sold'>Vendu</option>
              <option value='reserved'>Réservé</option>
              <option value='pending'>En cours</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Trier par
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='createdAt'>Date de création</option>
              <option value='title'>Titre</option>
              <option value='price'>Prix</option>
              <option value='year'>Année</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Ordre
            </label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='desc'>Décroissant</option>
              <option value='asc'>Croissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compteurs par statut */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        {[
          { status: 'active',   label: 'Disponibles', color: 'bg-green-50 border-green-200 text-green-700' },
          { status: 'reserved', label: 'Réservés',    color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { status: 'sold',     label: 'Vendus',      color: 'bg-red-50 border-red-200 text-red-700' },
          { status: 'pending',  label: 'En cours',    color: 'bg-gray-50 border-gray-200 text-gray-600' },
        ].map(({ status, label, color }) => {
          const count = vehicles.filter(v => v.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              className={`border rounded-xl p-4 text-left transition hover:shadow-sm ${color} ${statusFilter === status ? 'ring-2 ring-offset-1 ring-current' : ''}`}
            >
              <p className='text-2xl font-bold'>{count}</p>
              <p className='text-sm font-medium mt-0.5'>{label}</p>
            </button>
          );
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Liste des véhicules */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-lg shadow-sm border'>
            <div className='p-4 border-b'>
              <h3 className='text-lg font-semibold'>Véhicules</h3>
            </div>
            <div className='max-h-[600px] overflow-y-auto'>
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className={`p-3 border-b hover:bg-gray-50 ${
                    selectedVehicle?.id === vehicle.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    {/* Miniature */}
                    <div
                      className='shrink-0 cursor-pointer'
                      onClick={() => editVehicle(vehicle)}
                    >
                      {(vehicle.images && vehicle.images.length > 0) || (vehicle.imageUrls && vehicle.imageUrls.length > 0) ? (
                        <Image
                          src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].url : vehicle.imageUrls![0].url}
                          alt={vehicle.title}
                          width={56}
                          height={40}
                          className='rounded object-cover w-14 h-10'
                        />
                      ) : (
                        <div className='w-14 h-10 bg-gray-200 rounded flex items-center justify-center'>
                          <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className='flex-1 min-w-0 cursor-pointer' onClick={() => editVehicle(vehicle)}>
                      <p className='text-sm font-medium text-gray-900 truncate'>{vehicle.title}</p>
                      <p className='text-xs text-gray-500'>€{vehicle.price.toLocaleString('fr-FR')}</p>
                    </div>

                    {/* Statut inline modifiable */}
                    <select
                      value={vehicle.status}
                      onClick={e => e.stopPropagation()}
                      onChange={async e => {
                        e.stopPropagation();
                        const newStatus = e.target.value;
                        try {
                          await fetch(buildApiUrl(`/api/vehicles/${vehicle.id}`), {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: newStatus }),
                          });
                          fetchVehicles();
                        } catch {
                          setNotification({ type: 'error', message: 'Erreur lors du changement de statut' });
                        }
                      }}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-400 ${
                        vehicle.status === 'active'   ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'sold'     ? 'bg-red-100 text-red-800' :
                        vehicle.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value='active'>Disponible</option>
                      <option value='sold'>Vendu</option>
                      <option value='reserved'>Réservé</option>
                      <option value='pending'>En cours</option>
                    </select>
                  </div>

                  {/* Badges vedette / nouveau */}
                  {(vehicle.is_featured || vehicle.is_new) && (
                    <div className='flex gap-1 mt-1.5 ml-[68px]'>
                      {vehicle.is_featured && <span className='text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium'>Vedette</span>}
                      {vehicle.is_new && <span className='text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium'>Nouveau</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className='lg:col-span-2'>
          {isEditing || isCreating ? (
            <div className='bg-white rounded-lg shadow-sm border'>
              <div className='p-4 border-b'>
                <h3 className='text-lg font-semibold'>
                  {isCreating ? 'Nouveau véhicule' : 'Modifier le véhicule'}
                </h3>
              </div>

              <div className='p-6 space-y-6'>
                {/* Informations de base */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Titre *
                    </label>
                    <input
                      type='text'
                      value={formData.title || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Ex: BMW X5 3.0d xDrive'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Prix (€) *
                    </label>
                    <input
                      type='number'
                      value={formData.price || 0}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          price: parseInt(e.target.value),
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Année *
                    </label>
                    <input
                      type='number'
                      value={formData.year || new Date().getFullYear()}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          year: parseInt(e.target.value),
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Kilométrage
                    </label>
                    <input
                      type='number'
                      value={formData.mileage || 0}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          mileage: parseInt(e.target.value),
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Carburant *
                    </label>
                    <select
                      value={formData.fuel || 'petrol'}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, fuel: e.target.value }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='petrol'>Essence</option>
                      <option value='diesel'>Diesel</option>
                      <option value='hybrid'>Hybride</option>
                      <option value='electric'>Électrique</option>
                      <option value='lpg'>GPL</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Transmission *
                    </label>
                    <select
                      value={formData.transmission || 'manual'}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          transmission: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='manual'>Manuelle</option>
                      <option value='automatic'>Automatique</option>
                      <option value='semi-automatic'>Semi-automatique</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Localisation *
                    </label>
                    <input
                      type='text'
                      value={formData.location || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Ex: Munich, Allemagne'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Statut *
                    </label>
                    <select
                      value={formData.status || 'active'}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='active'>Disponible</option>
                      <option value='sold'>Vendu</option>
                      <option value='reserved'>Réservé</option>
                      <option value='pending'>En cours</option>
                    </select>
                  </div>
                </div>

                {/* Options */}
                <div className='flex space-x-4'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={formData.is_featured || false}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          is_featured: e.target.checked,
                        }))
                      }
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                    <span className='ml-2 text-sm text-gray-700'>
                      Véhicule en vedette
                    </span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={formData.is_new || false}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          is_new: e.target.checked,
                        }))
                      }
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                    <span className='ml-2 text-sm text-gray-700'>
                      Nouveau véhicule
                    </span>
                  </label>
                </div>

                {/* Gestion des images */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Images
                  </label>

                  {/* Zone de drag & drop */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {uploadingImages ? (
                      <div className='flex items-center justify-center'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                        <span className='ml-2 text-gray-600'>
                          Upload en cours...
                        </span>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className='mx-auto h-12 w-12 text-gray-400'
                          stroke='currentColor'
                          fill='none'
                          viewBox='0 0 48 48'
                        >
                          <path
                            d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <p className='mt-2 text-sm text-gray-600'>
                          Glissez-déposez des images ici, ou cliquez pour
                          sélectionner
                        </p>
                        <p className='text-xs text-gray-500'>
                          PNG, JPG, WEBP jusqu&#39;à 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Liste des images */}
                  {formData.images && formData.images.length > 0 && (
                    <div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4'>
                      {formData.images.map(image => (
                        <div key={image.id} className='relative group'>
                          <Image
                            src={image.url}
                            alt={image.alt}
                            width={200}
                            height={150}
                            className='w-full h-24 object-cover rounded-lg'
                          />
                          {image.isMain && (
                            <div className='absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded'>
                              Principale
                            </div>
                          )}
                          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100'>
                            <div className='flex space-x-2'>
                              <button
                                onClick={() => setMainImage(image.id)}
                                className='bg-blue-500 text-white p-1 rounded hover:bg-blue-600'
                                title='Définir comme image principale'
                              >
                                <svg
                                  className='w-4 h-4'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M5 13l4 4L19 7'
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => removeImage(image.id)}
                                className='bg-red-500 text-white p-1 rounded hover:bg-red-600'
                                title="Supprimer l'image"
                              >
                                <svg
                                  className='w-4 h-4'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Images ImporteMoi (imageUrls) + Process Images */}
                {selectedVehicle && selectedVehicle.imageUrls && selectedVehicle.imageUrls.length > 0 && (
                  <div className='border-t pt-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <div>
                        <h4 className='text-lg font-medium text-gray-900'>
                          Images ImporteMoi
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {selectedVehicle.imageUrls.length} image(s) disponible(s)
                        </p>
                      </div>
                      <button
                        onClick={processImages}
                        disabled={processingImages}
                        className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 ${
                          processingImages
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-linear-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700'
                        }`}
                      >
                        {processingImages ? (
                          <>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                            <span>Traitement...</span>
                          </>
                        ) : (
                          <>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                            <span>Process Images Studio</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Grille des images ImporteMoi */}
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4'>
                      {selectedVehicle.imageUrls.map((img, index) => (
                        <div key={index} className='relative group'>
                          <Image
                            src={img.url}
                            alt={`ImporteMoi ${index + 1}`}
                            width={200}
                            height={150}
                            className='w-full aspect-4/3 object-cover rounded-lg border-2 border-gray-200'
                          />
                          <div className='absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full'>
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Preview des images traitées */}
                    {formData.processedImages && (
                      <div className='mt-6 bg-gray-50 p-4 rounded-lg'>
                        <h5 className='text-sm font-semibold text-gray-700 mb-3'>
                          Images traitées (Studio)
                        </h5>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                          {([
                            { key: 'hero', label: 'Hero (1600x900)' },
                            { key: 'card', label: 'Card (600x400)' },
                            { key: 'thumbnail', label: 'Thumbnail (400x300)' },
                            { key: 'social', label: 'Social (1200x630)' },
                          ] as const).map(({ key, label }) => {
                            const url = formData.processedImages?.[key];
                            if (!url) return null;
                            const isPermanent = !url.startsWith('/api/tmp/');
                            const imgSrc = isPermanent ? buildApiUrl(url) : url;
                            return (
                              <div key={key} className='relative'>
                                <div className='text-xs font-medium text-gray-600 mb-1'>{label}</div>
                                <img
                                  src={imgSrc}
                                  alt={`${key} variant`}
                                  className='w-full h-auto rounded border'
                                />
                                <span className={`absolute top-6 right-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                  isPermanent
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {isPermanent ? 'Persistant' : 'Temporaire'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Description détaillée du véhicule...'
                  />
                </div>

                {/* Spécifications */}
                <div>
                  <h4 className='text-lg font-medium text-gray-900 mb-3'>
                    Spécifications techniques
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Moteur
                      </label>
                      <input
                        type='text'
                        value={formData.specifications?.engine || ''}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            specifications: {
                              power: '',
                              consumption: '',
                              acceleration: '',
                              color: '',
                              interior: '',
                              ...prev.specifications,
                              engine: e.target.value,
                            },
                          }))
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Ex: 3.0L V6 Turbo'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Puissance
                      </label>
                      <input
                        type='text'
                        value={formData.specifications?.power || ''}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            specifications: {
                              engine: '',
                              consumption: '',
                              acceleration: '',
                              color: '',
                              interior: '',
                              ...prev.specifications,
                              power: e.target.value,
                            },
                          }))
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Ex: 340 ch'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Consommation
                      </label>
                      <input
                        type='text'
                        value={formData.specifications?.consumption || ''}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            specifications: {
                              engine: '',
                              power: '',
                              acceleration: '',
                              color: '',
                              interior: '',
                              ...prev.specifications,
                              consumption: e.target.value,
                            },
                          }))
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Ex: 8.5L/100km'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Accélération 0-100
                      </label>
                      <input
                        type='text'
                        value={formData.specifications?.acceleration || ''}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            specifications: {
                              engine: '',
                              power: '',
                              consumption: '',
                              color: '',
                              interior: '',
                              ...prev.specifications,
                              acceleration: e.target.value,
                            },
                          }))
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Ex: 5.8s'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Couleur
                      </label>
                      <input
                        type='text'
                        value={formData.specifications?.color || ''}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            specifications: {
                              engine: '',
                              power: '',
                              consumption: '',
                              acceleration: '',
                              interior: '',
                              ...prev.specifications,
                              color: e.target.value,
                            },
                          }))
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Ex: Noir métallisé'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Intérieur
                      </label>
                      <input
                        type='text'
                        value={formData.specifications?.interior || ''}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            specifications: {
                              engine: '',
                              power: '',
                              consumption: '',
                              acceleration: '',
                              color: '',
                              ...prev.specifications,
                              interior: e.target.value,
                            },
                          }))
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Ex: Cuir noir'
                      />
                    </div>
                  </div>
                </div>

                {/* Équipements */}
                <div>
                  <div className='flex justify-between items-center mb-3'>
                    <h4 className='text-lg font-medium text-gray-900'>
                      Équipements
                    </h4>
                    <button
                      type='button'
                      onClick={addFeature}
                      className='bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600'
                    >
                      + Ajouter
                    </button>
                  </div>
                  <div className='space-y-2'>
                    {formData.features?.map((feature, index) => (
                      <div key={index} className='flex items-center space-x-2'>
                        <input
                          type='text'
                          value={feature.feature}
                          onChange={e => updateFeature(index, e.target.value)}
                          className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          placeholder='Ex: Climatisation automatique'
                        />
                        <button
                          type='button'
                          onClick={() => removeFeature(index)}
                          className='bg-red-500 text-white p-2 rounded hover:bg-red-600'
                        >
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex justify-end space-x-3 pt-6 border-t'>
                  <button
                    onClick={resetForm}
                    className='px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors'
                  >
                    Annuler
                  </button>
                  {!isCreating && (
                    <button
                      onClick={() => deleteVehicle(selectedVehicle!.id)}
                      className='px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors'
                    >
                      Supprimer
                    </button>
                  )}
                  <button
                    onClick={saveVehicle}
                    disabled={saving}
                    className='px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
                  >
                    {saving ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        <span>Sauvegarde...</span>
                      </>
                    ) : (
                      <span>Sauvegarder</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-lg shadow-sm border p-12 text-center'>
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                Aucun véhicule sélectionné
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                Sélectionnez un véhicule dans la liste ou créez-en un nouveau.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
