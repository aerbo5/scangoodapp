import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { Icons } from '../constants/icons';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

const CameraScreen = ({
  hasPermission,
  scanMode,
  setScanMode,
  cameraRef,
  onCapture,
  onPickFromGallery,
  onBack,
}) => {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const scanInstructions = {
    product: t('camera.positionProduct'),
    barcode: t('camera.alignBarcode'),
    receipt: t('camera.positionReceipt'),
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    
    setIsScanning(true);
    try {
      // Gerçek resim çek - yüksek kalite
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1.0, // Maksimum kalite
        base64: false,
        skipProcessing: false, // Tüm işlemleri yap
      });
      
      // Çekilen resmi state'e kaydet
      setCapturedImage(photo.uri);
      
      // Resim boyutlarını al
      if (photo.width && photo.height) {
        setImageDimensions({ width: photo.width, height: photo.height });
      } else {
        // Boyutlar yoksa, resmi yükleyip boyutlarını al
        Image.getSize(photo.uri, (imgWidth, imgHeight) => {
          setImageDimensions({ width: imgWidth, height: imgHeight });
        }, (error) => {
          console.warn('Could not get image dimensions:', error);
          setImageDimensions({ width: 0, height: 0 });
        });
      }
      
      setIsScanning(false);
      setHasScanned(true);
    } catch (error) {
      console.error('Error capturing image:', error);
      setIsScanning(false);
    }
  };

  const handleConfirmScan = async () => {
    // Kullanıcı Continue'ya bastı, direkt analiz et (TypeModal atlandı)
    if (capturedImage) {
      // Direkt resmi analiz et (type olmadan)
      // OCR ve Vision API ürün adını bulacak
      await onCapture(capturedImage, '');
      setHasScanned(false);
      setCapturedImage(null);
    }
  };

  const handleReScan = () => {
    setHasScanned(false);
    setIsScanning(false);
    setCapturedImage(null);
    setImageDimensions({ width: 0, height: 0 });
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.cameraContainer}>
        <Text style={styles.noPermissionText}>{t('camera.noAccess')}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>{t('camera.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderScanFrame = () => {
    if (scanMode === 'receipt') {
      // Receipt için uzun dikdörtgen çerçeve
      return (
        <View style={styles.scanFrame}>
          <View style={styles.receiptFrame}>
            {/* Sol üst köşe */}
            <View style={[styles.corner, styles.cornerTL]} />
            {/* Sağ üst köşe */}
            <View style={[styles.corner, styles.cornerTR]} />
            {/* Sol alt köşe */}
            <View style={[styles.corner, styles.cornerBL]} />
            {/* Sağ alt köşe */}
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>
      );
    } else if (scanMode === 'product') {
      // Product için kare çerçeve
      return (
        <View style={styles.scanFrame}>
          <View style={styles.productFrame}>
            {/* Sol üst köşe */}
            <View style={[styles.corner, styles.cornerTL]} />
            {/* Sağ üst köşe */}
            <View style={[styles.corner, styles.cornerTR]} />
            {/* Sol alt köşe */}
            <View style={[styles.corner, styles.cornerBL]} />
            {/* Sağ alt köşe */}
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>
      );
    } else {
      // Barcode için sade tasarım: üstte beyaz daire, altta yatay beyaz çizgi
      return (
        <View style={styles.scanFrame}>
          {/* Üstte beyaz daire */}
          <View style={styles.topCircle} />
          {/* Altta yatay beyaz çizgi */}
          <View style={styles.bottomLine} />
        </View>
      );
    }
  };

  return (
    <View style={styles.cameraContainer}>
      {hasScanned && capturedImage ? (
        // Resim çekildikten sonra resmi göster
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: capturedImage }} 
            style={styles.previewImage}
          />
          <View style={styles.previewOverlay}>
            <Text style={styles.previewText}>{t('camera.imageCaptured') || 'Image Captured'}</Text>
          </View>
        </View>
      ) : (
        // Kamera görünümü
        <CameraView style={styles.camera} ref={cameraRef}>
          {renderScanFrame()}
          {isScanning ? (
            <Text style={styles.scanInstructions}>{t('camera.scanning')}</Text>
          ) : (
            <Text style={styles.scanInstructions}>{scanInstructions[scanMode]}</Text>
          )}
        </CameraView>
      )}

      <View style={styles.cameraActions}>
        {hasScanned ? (
          // Resim çekildikten sonra Continue ve Re-scan butonları
          <View style={styles.rescanContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmScan}>
              <Text style={styles.confirmButtonText}>{t('common.continue')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rescanButton} onPress={handleReScan}>
              <Text style={styles.rescanButtonText}>{t('camera.reScan')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Kamera kontrolleri
          <View style={styles.captureControls}>
            <TouchableOpacity style={styles.galleryBtn} onPress={onPickFromGallery}>
              <Text style={styles.galleryIcon}>{Icons.gallery}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.captureBtn, isScanning && styles.captureBtnScanning]} 
              onPress={handleCapture}
              disabled={isScanning}
            >
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.flashBtn}>
              <Text style={styles.flashIcon}>{Icons.flash}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    zIndex: 1,
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Receipt için dikdörtgen frame
  // Sade scan frame - tüm modlar için aynı
  scanFrame: {
    width: width,
    height: height,
    position: 'relative',
  },
  topCircle: {
    position: 'absolute',
    top: 60,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
  },
  bottomLine: {
    position: 'absolute',
    bottom: 200,
    left: width * 0.1,
    right: width * 0.1,
    height: 2,
    backgroundColor: Colors.white,
  },
  // Receipt için uzun dikdörtgen çerçeve
  receiptFrame: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    right: width * 0.1,
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Product için kare çerçeve
  productFrame: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.15,
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanInstructions: {
    color: Colors.white,
    fontSize: 16,
    marginTop: Spacing.lg,
  },
  cameraActions: {
    backgroundColor: Colors.backgroundGreen,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  rescanContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    width: '100%',
  },
  confirmButton: {
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rescanButton: {
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  rescanButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  captureControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  captureBtnScanning: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryDark,
  },
  captureBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
  },
  galleryBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  galleryIcon: {
    fontSize: 26,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  flashBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  flashIcon: {
    fontSize: 26,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  noPermissionText: {
    color: Colors.white,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  backBtn: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignSelf: 'center',
  },
  backBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  previewOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: Spacing.md,
  },
  previewText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CameraScreen;

