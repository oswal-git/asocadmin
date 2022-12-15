import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IApiArticle, IArticle, IArticleImage, IDataItemArticle } from '@app/interfaces/api/iapi-articles.metadata';
import { IOptionsDialog, IResponseActionsUsers } from '@app/interfaces/ui/dialogs.interface';
import { IEglImagen, ISelectValues } from '@app/shared/controls';
import { environment } from '@env/environment';
import {
    faCircleDown,
    faCirclePlus,
    faCircleUp,
    faCircleXmark,
    faFileCircleMinus,
    faFloppyDisk,
    faKeyboard,
    faRightFromBracket,
    faTv,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ARTICLES_CONST } from '@app/data/constants/articles.const';
import { UsersService } from '@app/services/bd/users.service';
import { ArticlesService } from '@app/services/bd/articles.service';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { HelperClass } from '@app/core/helper';
import { Observable, Subscription } from 'rxjs';
import { IUserConnected } from '@app/interfaces/api/iapi-users.metadatos';

@Component({
    selector: 'app-form-article',
    templateUrl: './form-article.component.html',
    styleUrls: ['./form-article.component.scss'],
})
export class FormArticleComponent implements OnInit {
    private _name = 'FormArticleComponent';
    _log = true;

    @Input('options') optionsDialog!: IOptionsDialog;
    @Output() salir = new EventEmitter<IResponseActionsUsers>();

    oldPlainData!: IApiArticle;
    oldImageData!: IArticleImage;
    plainData!: IApiArticle;
    imageData!: IArticleImage;

    userProfile!: IUserConnected;
    userProfileOSubscription!: Subscription;
    isLogin: boolean = false;

    isSuper = false;
    isAdmin = false;

    loading = false;

    createForm = false;
    profileForm = false;
    browseForm = true;
    editForm = false;

    date = new Date();
    currentDate = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + ('00' + this.date.getDate()).slice(-2);

    @ViewChild('titlearticle') titlearticleRef!: ElementRef;
    @ViewChild('abstractarticle') abstractarticleRef!: ElementRef;
    @ViewChild('datepicker', { static: false })
    set datepicker(datepickerTag: any) {
        console.log('Componente ' + this._name + ': ViewChild datepicker: datepickerTag ─> ', datepickerTag);
        // console.log('Componente ' + this._name + ': ViewChild datepicker: currentDate ─> ', currentDate);
        // datepickerTag.nativeElement.value = this.currentDate;
        // value  new Date(),
        //     // setDefaultDate: new Date(2000,01,31),
        //     maxDate: new Date(),
        //     yearRange: [2022, 2023],
        //     format: 'yyyy/mm/dd',
    }
    titlearticleListener!: any;
    abstractarticleListener!: any;

    form!: FormGroup;

    articleResp: IResponseActionsUsers = { action: '', data: null, replay: { status: '', message: '' } };

    titleArticleMinLength: number = 5;
    titleArticleMaxLength: number = 100;
    abstractArticleMinLength: number = 5;
    abstractArticleMaxLength: number = 200;

    articleUrlDefault = environment.urlApi2 + '/assets/img/images.jpg';
    articleSrcDefault = environment.urlApi2 + '/assets/img/images.jpg';
    imgReadonly = false;
    articleImg: IEglImagen = {
        src: this.articleSrcDefault,
        nameFile: 'articleImg',
        filePath: '',
        fileImage: null,
        isSelectedFile: false,
        isDefault: this.articleSrcDefault === this.articleSrcDefault,
        isChange: false,
    };
    newItemArticle: IDataItemArticle = {
        image_item_article: {
            src: this.articleSrcDefault,
            nameFile: 'newitemarticle',
            filePath: '',
            fileImage: null,
            isSelectedFile: false,
            isDefault: this.articleSrcDefault === this.articleSrcDefault,
            isChange: false,
        },
        text_item_article: 'Nuevo artículo número uno por defecto',
    };
    categoryArticle: ISelectValues[] = [];
    subCategoryArticle: ISelectValues[] = [];
    stateArticle: ISelectValues[] = [];

    public article: IArticle = {
        id_article: 0,
        id_asociation_article: 0,
        id_user_article: 0,
        category_article: '',
        subcategory_article: '',
        class_article: '',
        state_article: 'redacción',
        publication_date_article: this.currentDate,
        effective_date_article: this.currentDate,
        expiration_date_article: '',
        cover_image_article: {
            src: this.articleSrcDefault,
            nameFile: '',
            filePath: '',
            fileImage: null,
            isSelectedFile: false,
            isDefault: this.articleSrcDefault === this.articleSrcDefault,
            isChange: false,
        },
        title_article: '',
        abstract_article: '',
        items_article: [],
        ubication_article: '',
        date_deleted_article: '',
        date_created_article: '',
        date_updated_article: '',
    };
    thereIsCover = false;

    faKeyboard = faKeyboard;
    faCircleUp = faCircleUp;
    faCircleDown = faCircleDown;
    faCirclePlus = faCirclePlus;
    faCircleXmark = faCircleXmark;
    faFileCircleMinus = faFileCircleMinus;
    faFloppyDisk = faFloppyDisk;
    faTv = faTv;
    faRightFromBracket = faRightFromBracket;

    minPublicatonDateArticle = this.currentDate;
    maxPublicatonDateArticle!: string;
    minEffectiveDateArticle = this.currentDate;
    maxEffectiveDateArticle!: string;
    minExpirationDateArticle = this.currentDate;
    maxExpirationDateArticle!: string;

    constructor(
        private _formBuilder: FormBuilder,
        private _usersService: UsersService,
        private _articlesService: ArticlesService,
        private _toastr: ToastrService,
        private router: Router,
        private renderer: Renderer2
    ) {
        this.loading = true;
        this.isSuper = false;
        this.isAdmin = false;

        if (!this.userProfileOSubscription) {
            // console.log('Componente ' + this._name + ': constructor: subscribe user ─> ');
            this.userProfileOSubscription = this._usersService.userProfile.subscribe({
                next: (user: IUserConnected) => {
                    // console.log('Componente ' + this._name + ': constructor: subscribe user ─> ', user);
                    this.isLogin = user.token_user !== '' ? true : false;
                    this.userProfile = user;
                    if (user.profile_user === 'superadmin') {
                        this.isSuper = true;
                    } else if (user.id_asoc_admin !== 0) {
                        this.isAdmin = true;
                    }

                    if (!this.isSuper && !this.isAdmin) {
                        // this._toastr.error('User not authorized to edit article', 'User not authorized to edit article');
                        this.salirClick();
                    }
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': constructor: error ─> ', err);
                },
                complete: () => {
                    console.log('Componente ' + this._name + ': constructor: complete ─> ');
                },
            });
        }

        this.form = this._formBuilder.group({
            cover_image_article: new FormControl({
                value: this.article.cover_image_article,
                disabled: false,
            }),
            title_article: new FormControl(
                { value: '', disabled: false },
                Validators.compose([
                    Validators.required,
                    Validators.minLength(this.titleArticleMinLength),
                    Validators.maxLength(this.titleArticleMaxLength),
                ])
            ),
            abstract_article: new FormControl(
                { value: '', disabled: false },
                Validators.compose([
                    Validators.required,
                    Validators.minLength(this.abstractArticleMinLength),
                    Validators.maxLength(this.abstractArticleMaxLength),
                ])
            ),
            category_article: new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
            subcategory_article: new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
            state_article: new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
            publication_date_article: new FormControl(
                { value: this.article.publication_date_article, disabled: false },
                Validators.compose([Validators.required])
            ),
            effective_date_article: new FormControl({ value: '', disabled: false }, Validators.compose([])),
            expiration_date_article: new FormControl({ value: '', disabled: false }, Validators.compose([])),

            items_article: this._formBuilder.array([]),
        });

        this.categoryArticleField.valueChanges.subscribe((value) => {
            this.form.value.subcategory_article = '';
            this.subCategoryArticle = [];
            const list = ARTICLES_CONST.ARTICLES_CATEGORY.filter((cat: any) => cat.caption === value).map((cat: any) => cat.subcategory);

            this.subCategoryArticle = list[0];
            this.subCategoryArticleField.enable();
            this.subCategoryArticleField.markAsUntouched();
        });

        this.publicatonDateField.valueChanges.subscribe((value) => {
            console.log('Componente ' + this._name + ': publicatonDateField: value ─> ', value);
            if (value > this.form.value.effective_date_article) {
                this.effectiveDateField.setValue(value);
                this.minEffectiveDateArticle = value;
            } else {
                this.minEffectiveDateArticle = value;
            }
        });

        this.effectiveDateField.valueChanges.subscribe((value) => {
            console.log('Componente ' + this._name + ': effectiveDateField: value ─> ', value);
            const expiration_date_article = this.form.value.expiration_date_article === '' ? '9999-12-31' : this.form.value.expiration_date_article;
            if (value > expiration_date_article) {
                this.expirationDateField.setValue(value);
                this.minExpirationDateArticle = value;
            } else {
                this.minExpirationDateArticle = value;
            }
        });

        this.stateArticleField.valueChanges.subscribe((value) => {
            console.log('Componente ' + this._name + ': stateArticleField: value ─> ', value);
            console.log('Componente ' + this._name + ': coverImageArticleField: this.coverImageArticleField ─> ', this.coverImageArticleField.value);
            if (value.toLowerCase() === 'redacción') {
                this.imgReadonly = false;
            } else {
                if (this.coverImageArticleField.value.isDefault) {
                    this.stateArticleField.setValue('redacción');
                    this.imgReadonly = false;
                } else {
                    this.imgReadonly = true;
                }
            }
        });

        this.coverImageArticleField.valueChanges.subscribe((value: any) => {
            console.log('Componente ' + this._name + ': coverImageArticleField: value ─> ', value);
            if (value.isDefault) {
                this.stateArticleField.disable();
                this.thereIsCover = false;
                console.log('Componente ' + this._name + ': coverImageArticleField: thereIsCover ─> ', this.thereIsCover);
                console.log('Componente ' + this._name + ': coverImageArticleField: form.invalid ─> ', this.form.invalid);
            } else {
                this.stateArticleField.enable();
                this.thereIsCover = true;
                console.log('Componente ' + this._name + ': coverImageArticleField: thereIsCover ─> ', this.thereIsCover);
                console.log('Componente ' + this._name + ': coverImageArticleField: form.invalid ─> ', this.form.invalid);
            }
        });

        this.getAuxiliarData();
    }

    ngOnInit(): void {
        console.log('Componente ' + this._name + ': ngOnInit: this.optionsDialog  ─>', this.optionsDialog);
        async () => {};

        if (this.optionsDialog.id === 'edit') {
            this.article = this.optionsDialog.record;
        }

        this.articleResp.action = this.optionsDialog.id;
        this.articleResp.data = this.article;

        this.oldPlainData = {
            data: {
                id_article: this.article.id_article,
                id_asociation_article: this.article.id_asociation_article,
                id_user_article: this.article.id_user_article,
                category_article: this.article.category_article,
                subcategory_article: this.article.subcategory_article,
                class_article: this.article.class_article,
                state_article: this.article.state_article,
                publication_date_article: this.article.publication_date_article,
                effective_date_article: this.article.effective_date_article,
                expiration_date_article: this.article.expiration_date_article,
                title_article: this.article.title_article,
                abstract_article: this.article.abstract_article,
                ubication_article: this.article.ubication_article,
                date_updated_article: this.article.date_updated_article,
            },
            items: [],
        };

        this.oldImageData = {
            id_article: this.article.id_article,
            id_asociation_article: this.article.id_asociation_article,
            cover_image_article: this.article.cover_image_article,
            items_article: [],
            date_updated_article: this.article.date_updated_article,
        };

        this.article.items_article.map((item: IDataItemArticle, index: number) => {
            if (item.text_item_article !== '' || !item.image_item_article.isDefault) {
                this.oldPlainData.items.push({
                    id_item_article: index,
                    text_item_article: item.text_item_article,
                    is_default_image: item.image_item_article.isDefault,
                });
            }
            if (!item.image_item_article.isDefault) {
                this.oldImageData.items_article.push({
                    id_item_article: index,
                    image_item_article: item.image_item_article,
                });
            }
        });

        this.buildForm();
    }

    ngAfterViewInit(): void {
        this.abstractarticleListener = this.renderer.listen(this.abstractarticleRef.nativeElement, 'keydown', (evt) => {
            setTimeout(this.changeSizeRef, 0, evt.target, this.abstractArticleMaxLength);
        });

        this.titlearticleListener = this.renderer.listen(this.titlearticleRef.nativeElement, 'keydown', (evt) => {
            console.log('Componente ' + this._name + ': autosize: this.titlearticleRef.nativeElement ─> ', this.titlearticleRef.nativeElement);
            console.log('Componente ' + this._name + ': autosize: evt ─> ', evt);
            setTimeout(this.changeSizeRef, 0, evt.target, this.titleArticleMaxLength);
        });
        console.log('Componente ' + this._name + ': autosize: this.abstractarticleRef ─> ', this.abstractarticleRef.nativeElement.value);

        this.changeSizeRef(this.titlearticleRef.nativeElement, this.titleArticleMaxLength);
        this.changeSizeRef(this.abstractarticleRef.nativeElement, this.abstractArticleMaxLength);
    }

    changeSizeRef(ref: any, _size: number) {
        // if (ref.value.length >= size) {
        //     ref.value = ref.value.substring(0, size);
        //     // return;
        // }
        ref.style.cssText = 'height:auto; padding:0';
        ref.style.cssText = '-moz-box-sizing:content-box';
        ref.style.cssText = 'height:' + (ref.scrollHeight + 10) + 'px';
        console.log('Componente ' + this._name + ': timeOut:ref.value  ─> ', ref.value);
        console.log('Componente ' + this._name + ': timeOut:ref.style.cssText  ─> ', ref.style.cssText);
    }

    ngOnDestroy() {
        this.titlearticleListener();
        this.abstractarticleListener();
    }

    getAuxiliarData() {
        this.categoryArticle = ARTICLES_CONST.ARTICLES_CATEGORY;
        this.stateArticle = ARTICLES_CONST.ARTICLES_STATE;
        return '';
    }

    buildForm() {
        this.coverImageArticleField.setValue(this.article.cover_image_article);
        this.titleArticleField.setValue(this.article.title_article);
        this.abstractArticleField.patchValue(this.article.abstract_article);
        this.categoryArticleField.setValue(this.article.category_article);
        this.subCategoryArticleField.setValue(this.article.subcategory_article);
        this.stateArticleField.setValue(this.article.state_article);
        this.publicatonDateField.setValue(this.article.publication_date_article);
        this.effectiveDateField.setValue(this.article.effective_date_article);
        this.expirationDateField.setValue(this.article.expiration_date_article);

        this.buildItems();

        if (this.optionsDialog.id == 'create') {
            this.subCategoryArticleField.disable();
        }

        this.loading = false;
    }

    buildItems() {
        this.article.items_article.map((v) => {
            let item = new FormControl(
                { value: { image_item_article: v.image_item_article, text_item_article: v.text_item_article }, disabled: false },
                Validators.compose([Validators.required])
            );
            return this.itemsArticleField.push(item);
        });
        console.log('Componente ' + this._name + ': buildItems: this.itemsArticleField ─> ', this.itemsArticleField);
    }

    addItemArticle(_index: number): void {
        // if (index < this.itemsArticleField.length) {
        // }
        console.log('Componente ' + this._name + ': this.itemsArticleField:  ─> ', this.itemsArticleField);
        this.itemsArticleField.push(
            // index + 1,
            this._formBuilder.control(
                {
                    value: {
                        image_item_article: {
                            src: this.articleSrcDefault,
                            nameFile: 'newitemarticle',
                            filePath: '',
                            fileImage: null,
                            isSelectedFile: false,
                            isDefault: true,
                            isChange: false,
                        },
                        text_item_article: '',
                    },
                    disabled: false,
                },
                Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50)])
            )
        );
    }

    moveItemArticle(shift: number, i: number): void {
        console.log('Componente ' + this._name + ': this.itemsArticleField:  ─> ', this.itemsArticleField);

        const items = this.itemsArticleField as FormArray;

        let newIndex: number = i + shift;
        if (newIndex === -1) {
            newIndex = items.length - 1;
        } else if (newIndex == items.length) {
            newIndex = 0;
        }

        const currentGroup = items.at(i);
        items.removeAt(i);
        items.insert(newIndex, currentGroup);

        console.log('Componente ' + this._name + ': this.itemsArticleField:  ─> ', this.itemsArticleField);
    }

    deleteItemArticle(item: number) {
        this.itemsArticleField.removeAt(item);
    }

    onReady(datepicker: Event) {
        console.log('Componente ' + this._name + ': onReady: datepicker ─> ', datepicker);
    }

    async save() {
        console.log('Componente ' + this._name + ': save: this.form.value ─> ', this.form.value);
        if (!this.form.valid) {
            this.form.markAllAsTouched;
            this._toastr.error('Fields are required', 'Fill fields, please');
            return;
        }
        console.log('Componente ' + this._name + ': save: this._usersService.userProfile.id_asoc_admin ─> ', this.userProfile.id_asoc_admin);

        // this.plainData.id_article = this.form.value.id_article;
        this.plainData = {
            data: {
                id_article: this.article.id_article,
                id_asociation_article: this.article.id_asociation_article === 0 ? this.userProfile.id_asoc_admin : this.article.id_asociation_article,
                id_user_article: this.userProfile.id_user,
                category_article: this.form.value.category_article,
                subcategory_article: this.form.value.subcategory_article,
                class_article: '',
                state_article: this.form.value.state_article,
                publication_date_article: this.form.value.publication_date_article,
                effective_date_article: this.form.value.effective_date_article,
                expiration_date_article: this.form.value.expiration_date_article,
                title_article: this.form.value.title_article,
                abstract_article: this.form.value.abstract_article,
                ubication_article: '',
                date_updated_article: this.article.date_updated_article,
            },
            items: [],
        };

        this.imageData = {
            id_article: this.article.id_article,
            id_asociation_article: this.plainData.data.id_asociation_article,
            cover_image_article: this.form.value.cover_image_article,
            items_article: [],
            date_updated_article: this.plainData.data.date_updated_article,
        };

        let numItems = 0;
        this.form.value.items_article.map((item: IDataItemArticle, index: number) => {
            // if (item.text_item_article !== '' || !item.image_item_article.isDefault) {
            this.plainData.items.push({
                id_item_article: index,
                text_item_article: item.text_item_article,
                is_default_image: item.image_item_article.isDefault,
            });
            // }
            if (!item.image_item_article.isDefault) {
                ++numItems;
                this.imageData.items_article.push({
                    id_item_article: index,
                    image_item_article: item.image_item_article,
                });
            }
        });

        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.oldPlainData', '', JSON.parse(JSON.stringify(this.oldPlainData)));
        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.plainData', '', JSON.parse(JSON.stringify(this.plainData)));

        if (HelperClass.compareObj(this.oldPlainData, this.plainData) && HelperClass.compareObj(this.oldImageData, this.imageData)) {
            this._toastr.error('Nothing changed', 'Nothing changed');
            return;
        }

        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.oldImageData', '', JSON.parse(JSON.stringify(this.oldImageData)));
        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.imageData', '', JSON.parse(JSON.stringify(this.imageData)));
        // let finish = { status: '', message: 'Unknown error' };

        // actualize only plain data of article and items
        const res: any = await this.saveData();
        HelperClass.consoleLog(this._log, this._name, 'save', 'saveData', 'end', 'res', res);
        if (res.status !== 'ok') {
            this._toastr.error(res.message, res.title);
            return;
        }

        HelperClass.consoleLog(
            this._log,
            this._name,
            'save',
            '',
            'this.oldImageData.cover_image_article',
            '',
            JSON.parse(JSON.stringify(this.oldImageData.cover_image_article))
        );
        HelperClass.consoleLog(
            this._log,
            this._name,
            'save',
            '',
            'this.imageData.cover_image_article',
            '',
            JSON.parse(JSON.stringify(this.imageData.cover_image_article))
        );

        let respItemImage = { status: '', message: '', title: '' };
        if (this.oldImageData.cover_image_article !== this.imageData.cover_image_article) {
            if (
                this.imageData.cover_image_article.src === this.articleSrcDefault &&
                this.oldImageData.cover_image_article.src !== this.articleSrcDefault
            ) {
                try {
                    const asoc = this.userProfile.id_asoc_admin === 0 ? '9'.repeat(9) : this.userProfile.id_asoc_admin;
                    const data = {
                        action: 'delete',
                        id_article: this.articleResp.data.id_article,
                        id_asociation_article: asoc.toString(),
                        date_updated_article: this.articleResp.data.date_updated_article,
                    };
                    const respDeleteCover: any = await this.deleteCover(data);
                    console.log('Componente ' + this._name + ': save: deleteCover ─> ', respDeleteCover);
                    if (respDeleteCover.status === 'ok' || respDeleteCover.status === 'success') {
                        this.articleResp.data = respDeleteCover.result;
                        console.log('Componente ' + this._name + ': save: deleteCover ok ─> ', respDeleteCover);
                        this.updateOldRecord(this.articleResp.data);
                    } else {
                        console.log('Componente ' + this._name + ': save: deleteCover error ─> ', respDeleteCover.message, respDeleteCover.code);
                        this._toastr.error(respDeleteCover.message, 'Error deleting cover image');
                        return;
                    }
                } catch (error: any) {
                    console.log('Componente ' + this._name + ': save: deleteCover error ─> ', error);
                    this._toastr.error(error, 'Unexpected error deleting logo');
                    return;
                }
            } else {
                HelperClass.consoleLog(this._log, this._name, 'save', '', 'actualize cover', '');
                const element = {
                    cover: true,
                    id_article: this.articleResp.data.id_article,
                    id_asociation_article: this.userProfile.id_asoc_admin,
                    cover_image_article: this.form.value.cover_image_article,
                };
                const respCover = await this.uploadImage(element);
                HelperClass.consoleLog(this._log, this._name, 'save', '', 'uploadImage', 'respCover', JSON.parse(JSON.stringify(respCover)));

                if (respCover.status === 'ok' || respCover.status === 'success') {
                    this.articleResp.data = respCover.result;
                    await this.updateOldRecord(this.articleResp.data);
                } else {
                    console.log('Componente ' + this._name + ': manageLogo: uploadImage respUpload.message ─> ', respCover.message);
                    this._toastr.error(respCover.message, 'Error load cover image');
                    return;
                }
            }

            HelperClass.consoleLog(this._log, this._name, 'save', 'cover', 'updateItemsImage', '');
            respItemImage = await this.updateItemsImage(numItems);
            HelperClass.consoleLog(
                this._log,
                this._name,
                'save',
                'cover',
                'updateItemsImage',
                'updateItemsImage',
                JSON.parse(JSON.stringify(respItemImage))
            );
        } else {
            HelperClass.consoleLog(this._log, this._name, 'save', 'not cover', 'updateItemsImage', '');
            respItemImage = await this.updateItemsImage(numItems);
            HelperClass.consoleLog(
                this._log,
                this._name,
                'save',
                'not cover',
                'updateItemsImage',
                'updateItemsImage',
                JSON.parse(JSON.stringify(respItemImage))
            );
        }

        if (respItemImage.status !== 'ok') {
            this._toastr.error(respItemImage.message, respItemImage.title);
            return;
        }

        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.articleResp', '', JSON.parse(JSON.stringify(this.articleResp)));
        this.exitForm(this.articleResp);
        return;
    }

    saveData = (): Promise<any> => {
        switch (this.optionsDialog.id) {
            case 'create':
                HelperClass.consoleLog(
                    this._log,
                    this._name,
                    'saveData',
                    'switch',
                    'this.optionsDialog.id',
                    'create',
                    JSON.parse(JSON.stringify(this.optionsDialog.id))
                );
                return new Promise((resolve) => {
                    this.createArticle().then((finish: any) => {
                        resolve({ status: finish.status, message: finish.message, title: 'Error creating article' });
                    });
                });
                break;

            case 'edit':
                HelperClass.consoleLog(
                    this._log,
                    this._name,
                    'saveData',
                    'switch',
                    'this.optionsDialog.id',
                    'edit',
                    JSON.parse(JSON.stringify(this.optionsDialog.id))
                );

                return new Promise((resolve) => {
                    this.modifyArticle().then((finish: any) => {
                        resolve({ status: finish.status, message: finish.message, title: 'Error modifying article' });
                    });
                });

                break;

            case 'delete':
                return Promise.resolve({ status: 'ok', message: '', title: 'Error deleting article' });
                break;

            default:
                return Promise.resolve({ status: 'ok', message: '', title: 'Error saving article' });
                break;
        }
    };

    updateItemsImage = (numItems: number): Promise<any> => {
        return new Promise(async (resolve, _reject) => {
            if (numItems > 0) {
                let respItemImage: any = {};
                this._log
                    ? console.log(
                          'Componente ' + this._name + ': updateItemsImage: this.imageData.items_article.length ─> ',
                          this.imageData.items_article.length
                      )
                    : '';
                for (let index = 0; index < this.imageData.items_article.length; index++) {
                    // HelperClass.consoleLog(this._log, this._name, 'updateItemsImage', '', 'index', '', index);
                    this._log ? console.log('Componente ' + this._name + ': updateItemsImage: index ─> ', index) : '';

                    const element = {
                        cover: false,
                        id_article: this.articleResp.data.id_article,
                        id_item_article: this.imageData.items_article[index].id_item_article,
                        image_item_article: this.imageData.items_article[index].image_item_article,
                    };

                    respItemImage = await this.uploadImage(element, index + 1, numItems);
                    this._log ? console.log('Componente ' + this._name + ': updateItemsImage: respItemImage - index ─> ', index, respItemImage) : '';
                    if (respItemImage.status !== 'success') {
                        this._log
                            ? console.log(
                                  'Componente ' +
                                      this._name +
                                      ': updateItemsImage: promisesUpdateItemsImages - promiseUpdateItemImage resolve err ─>',
                                  respItemImage.status
                              )
                            : '';

                        resolve({
                            status: respItemImage.status,
                            message: respItemImage.message,
                            title: 'Error load item image ' + index.toString(),
                            result: null,
                        });
                    } else {
                        this._log
                            ? console.log(
                                  'Componente ' + this._name + ': updateItemsImage: promisesUpdateItemsImages - promiseUpdateItemImage resolve ok ─>',
                                  respItemImage.result
                              )
                            : '';
                        this.articleResp.data = respItemImage.result;
                    }
                }
                await this.updateOldRecord(this.articleResp.data);

                this._log ? console.log('Componente ' + this._name + ': updateItemsImage: end for ─>') : '';

                resolve({ status: 'ok', message: '', title: '' });
            } else {
                this._log ? console.log('Componente ' + this._name + ': updateItemsImage: No items ─>') : '';
                resolve({ status: 'ok', message: 'No items', title: '' });
            }
        });
    };

    previewClick() {
        if (!this.form.valid) {
            this.form.markAllAsTouched;
            this._toastr.error('Fields are required', 'Fill fields for preview, please');
            return;
        }

        const articlePreview = this.form.value;
        console.log('Componente ' + this._name + ': previewClick: articlePreview ─> ', articlePreview);
        articlePreview['user'] = {
            id_user: this.userProfile.id_user,
            name_user: this.userProfile.name_user,
            last_name_user: this.userProfile.last_name_user,
            profile_user: this.userProfile.profile_user,
            avatar_user: this.userProfile.avatar_user,
        };

        console.log('Componente ' + this._name + ': previewClick: articlePreview ─> ', articlePreview);

        this._articlesService.setSessionArticlePreview(articlePreview);

        // this.router.navigateByUrl('/dashboard/preview-articulo');
        const url: any = this.router.createUrlTree(['/dashboard/preview-articulo']);

        window.open(url, '_blank');
    }

    createArticle(): Promise<any> {
        return new Promise(async (resolve, _reject) => {
            try {
                this._articlesService.createArticle(this.plainData).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': createArticle: resp ─> ', resp);
                        if (resp.status === 200) {
                            this.articleResp.data = resp.result;
                            console.log('Componente ' + this._name + ': createArticle: this.articleResp ─> ', this.articleResp);
                            resolve({ status: 'ok', message: 'El usuario se creó con exito' });
                        } else {
                            console.log('Componente ' + this._name + ': createArticle: error ─> resp.message', resp.message);
                            resolve({ status: 'error', message: resp.message });
                        }
                    },
                    error: (err: any) => {
                        console.log('Componente ' + this._name + ': createArticle: error ─> create', err);
                        // reject(false);
                        resolve({ status: 'error', message: err });
                    },
                    complete: () => {
                        console.log('Componente ' + this._name + ': createArticle: complete ─> create');
                    },
                });
            } catch (error: any) {
                this.loading = false;
                console.log('Componente ' + this._name + ': createArticle: catch error ─> ', error);
                resolve({ status: 'error', message: error });
                // reject(false);
            }
        });
    }

    modifyArticle(): Promise<any> {
        return new Promise(async (resolve, _reject) => {
            try {
                if (HelperClass.compareObj(this.oldPlainData, this.plainData)) {
                    HelperClass.consoleLog(
                        this._log,
                        this._name,
                        'modifyArticle',
                        'Promise',
                        'compareObj',
                        'resolve',
                        JSON.parse(JSON.stringify(HelperClass.compareObj(this.oldPlainData, this.plainData)))
                    );
                    resolve({ status: 'ok', message: 'Nothing to actualize' });
                } else {
                    HelperClass.consoleLog(this._log, this._name, 'modifyArticle', 'Promise', '', 'continue');

                    this._articlesService.modifyArticle(this.plainData).subscribe({
                        next: async (resp: any) => {
                            console.log('Componente ' + this._name + ': modifyArticle: resp ─> ', resp);
                            if (resp.status === 200) {
                                console.log('Componente ' + this._name + ': modifyArticle: this.articleResp ─> ', this.articleResp);
                                this.articleResp.data = resp.result;
                                console.log('Componente ' + this._name + ': modifyArticle: this.articleResp ─> ', this.articleResp);
                                resolve({ status: 'ok', message: 'El artículo se modificó con exito' });
                            } else {
                                console.log('Componente ' + this._name + ': modifyArticle: error ─> resp.message', resp.message);
                                resolve({ status: 'error', message: resp.message });
                            }
                        },
                        error: (err: any) => {
                            console.log('Componente ' + this._name + ': modifyArticle: error ─> create', err);
                            // reject(false);
                            resolve({ status: 'error', message: err });
                        },
                        complete: () => {
                            console.log('Componente ' + this._name + ': modifyArticle: complete ─> create');
                        },
                    });
                }
            } catch (error: any) {
                this.loading = false;
                console.log('Componente ' + this._name + ': modifyArticle: catch error ─> ', error);
                resolve({ status: 'error', message: error });
                // reject(false);
            }
        });
    }

    uploadImage(image: any, index: number = 0, items: number = 0): Promise<any> {
        // const authHeaders = ''; // await this._usersService.getAuthHeaders();

        return new Promise(async (resolve, _reject) => {
            const asoc = this.userProfile.id_asoc_admin === 0 ? '9'.repeat(9) : this.userProfile.id_asoc_admin;
            let isNew = false;
            let post = true;
            const fd = new FormData();
            let data: any = {};
            this._log ? console.log('Componente ' + this._name + ': uploadImage: image ─>', image) : '';
            this._log
                ? console.log(
                      'Componente ' + this._name + ': uploadImage: this.userProfile.date_updated_user ─> ',
                      this.userProfile.date_updated_user
                  )
                : '';

            isNew = !image.cover && image.image_item_article.isSelectedFile ? true : false;

            if (image.cover || isNew) {
                fd.append('action', 'upload');
                fd.append('token', this.userProfile.token_user);
                fd.append('user_id', this.userProfile.id_user.toString());
                fd.append('module', 'articles');
                fd.append('date_updated', this.userProfile.date_updated_user);
                fd.append('date_updated_article', this.articleResp.data.date_updated_article);
                if (image.cover) {
                    fd.append('cover', 'cover');
                    fd.append('id_article', image.id_article.toString());
                    fd.append('id_asociation_article', asoc.toString());
                    fd.append('user_name', 'cover');
                    fd.append('name', 'cover.png');
                    fd.append('prefix', 'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/cover');
                    fd.append('file', image.cover_image_article.fileImage, 'cover.png');
                } else {
                    fd.append('cover', 'item');
                    fd.append('id_article', image.id_article.toString());
                    fd.append('id_item_article', image.id_item_article.toString());
                    fd.append('id_asociation_article', asoc.toString());
                    fd.append('index', index.toString());
                    fd.append('first', index === 1 ? true.toString() : false.toString());
                    fd.append('last', index === items ? true.toString() : false.toString());
                    fd.append('items', items.toString());
                    fd.append('user_name', 'item-' + image.id_item_article);
                    fd.append('name', 'item-' + image.id_item_article + '.png');
                    fd.append('prefix', 'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/items-images');
                    fd.append('file', image.image_item_article.fileImage, 'item-' + image.id_item_article + '.png');
                }
                // fd.append('name', this.logoImg.nameFile);
            } else {
                data = {
                    action: 'upload',
                    // token: this.userProfile.token_user,
                    user_id: this.userProfile.id_user.toString(),
                    module: 'articles',
                    date_updated: this.userProfile.date_updated_user,
                    date_updated_article: this.articleResp.data.date_updated_article,
                    cover: 'item',
                    id_article: image.id_article.toString(),
                    id_item_article: image.id_item_article.toString(),
                    id_asociation_article: asoc.toString(),
                    index: index.toString(),
                    first: index === 1 ? true.toString() : false.toString(),
                    last: index === items ? true.toString() : false.toString(),
                    items: items.toString(),
                    user_name: 'item-' + image.id_item_article,
                    name: 'item-' + image.id_item_article + '.png',
                    prefix: 'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/items-images',
                    file_src: image.image_item_article.src,
                };
            }
            // if (this.logoImg.fileImage !== null) {
            // }
            let observable: Observable<any>;

            if (items > 0) {
                if (isNew) {
                    observable = this._articlesService.uploadImageItem(fd);
                    post = true;
                } else {
                    observable = this._articlesService.moveImageItem(data);
                    post = false;
                }
            } else {
                observable = this._articlesService.uploadImage(fd);
                post = true;
            }
            // this._articlesService.uploadImage(fd).subscribe({
            const subscription: Subscription = observable.subscribe({
                next: (event: any) => {
                    console.log('Componente ' + this._name + ': uploadImages: event ─> ', event);
                    if (event.type === HttpEventType.UploadProgress) {
                        console.log('Componente ' + this._name + ': uploadImages: UploadProgress event.type ─> ', HttpEventType.UploadProgress);
                        console.log(
                            'Componente ' + this._name + ': uploadImages: Upload progress ─> ',
                            event.total ? Math.round(event.loaded / event.total) * 100 + ' %' : '--'
                        );
                    } else if (event.type === HttpEventType.Response) {
                        console.log('Componente ' + this._name + ': uploadImages: response event ─> ', event);
                        console.log('Componente ' + this._name + ': uploadImages: response event.type ─> ', HttpEventType.Response);
                        subscription.unsubscribe();
                        resolve({ status: 'success', message: '', result: event.body.result });
                    } else if (!post) {
                        console.log('Componente ' + this._name + ': uploadImages: else type event ─> ', event);
                        resolve({ status: 'success', message: '', result: event.result });
                    }
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': uploadImages: error ─> ', err);
                    subscription.unsubscribe();
                    resolve({ status: 'error', message: err.error.message, result: null });
                },
                complete: () => {
                    console.log('Componente ' + this._name + ': uploadImages: complete ─> post uploadImages');
                },
            });
        });
    }

    deleteCover(data: any): Promise<any> {
        return new Promise((resolve, _reject) => {
            this._articlesService.deleteCover(data).subscribe({
                next: (event: any) => {
                    console.log('Componente ' + this._name + ': deleteCover: event ─> ', event);
                    resolve({ status: 'success', message: '', result: event.result });
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': deleteCover: error ─> ', err);
                    resolve({ status: 'error', message: err.error.message, result: null });
                },
                complete: () => {
                    console.log('Componente ' + this._name + ': deleteCover: complete ─> ');
                },
            });
        });
    }

    salirClick() {
        this.exitForm(null);
    }

    exitForm(datosSalida: IResponseActionsUsers | any) {
        if (datosSalida === null) {
            datosSalida = { action: 'exit', data: '', replay: { status: '', message: '' } };
        }
        console.log('Componente ' + this._name + ': exitForm:  ─> this.salir.emit: ', datosSalida);
        this.salir.emit(datosSalida);
    }

    get itemsArticleField(): any {
        return this.form.get('items_article') as FormArray;
    }

    get itemsArticleIsValid(): boolean {
        return this.form.get('items_article')!.valid && this.form.get('items_article')!.touched;
    }

    get itemsArticleIsInvalid(): boolean {
        return this.form.get('items_article')!.invalid && this.form.get('items_article')!.touched;
    }

    get coverImageArticleField(): any {
        return this.form.get('cover_image_article');
    }

    get coverImageArticleIsValid(): boolean {
        return this.form.get('cover_image_article')!.valid && this.form.get('cover_image_article')!.touched;
    }

    get coverImageArticleIsInvalid(): boolean {
        return this.form.get('cover_image_article')!.invalid && this.form.get('cover_image_article')!.touched;
    }

    get titleArticleField(): AbstractControl {
        return this.form.get('title_article')!;
    }

    get titleArticleIsValid(): boolean {
        return this.form.get('title_article')!.valid && this.form.get('title_article')!.touched;
    }

    get titleArticleIsInvalid(): boolean {
        return this.form.get('title_article')!.invalid && this.form.get('title_article')!.touched;
    }

    get abstractArticleField(): AbstractControl {
        return this.form.get('abstract_article')!;
    }

    get abstractArticleIsValid(): boolean {
        return this.form.get('abstract_article')!.valid && this.form.get('abstract_article')!.touched;
    }

    get abstractArticleIsInvalid(): boolean {
        return this.form.get('abstract_article')!.invalid && this.form.get('abstract_article')!.touched;
    }

    get categoryArticleField(): AbstractControl {
        return this.form.get('category_article')!;
    }

    get categoryArticleIsValid(): boolean {
        return this.form.get('category_article')!.valid && this.form.get('category_article')!.touched;
    }

    get categoryArticleIsInvalid(): boolean {
        return this.form.get('category_article')!.invalid && this.form.get('category_article')!.touched;
    }

    get subCategoryArticleField(): AbstractControl {
        return this.form.get('subcategory_article')!;
    }

    get subCategoryArticleIsValid(): boolean {
        return this.form.get('subcategory_article')!.valid && this.form.get('subcategory_article')!.touched;
    }

    get subCategoryArticleIsInvalid(): boolean {
        return this.form.get('subcategory_article')!.invalid && this.form.get('subcategory_article')!.touched;
    }

    get stateArticleField(): AbstractControl {
        return this.form.get('state_article')!;
    }

    get stateArticleIsValid(): boolean {
        return this.form.get('state_article')!.valid && this.form.get('state_article')!.touched;
    }

    get stateArticleIsInvalid(): boolean {
        return this.form.get('state_article')!.invalid && this.form.get('state_article')!.touched;
    }

    get publicatonDateField(): AbstractControl {
        return this.form.get('publication_date_article')!;
    }

    get publicatonDateIsValid(): boolean {
        return this.form.get('publication_date_article')!.valid && this.form.get('publication_date_article')!.touched;
    }

    get publicatonDateIsInvalid(): boolean {
        return this.form.get('publication_date_article')!.invalid && this.form.get('publication_date_article')!.touched;
    }

    get effectiveDateField(): AbstractControl {
        return this.form.get('effective_date_article')!;
    }

    get effectiveDateIsValid(): boolean {
        return this.form.get('effective_date_article')!.valid && this.form.get('effective_date_article')!.touched;
    }

    get effectiveDateIsInvalid(): boolean {
        return this.form.get('effective_date_article')!.invalid && this.form.get('effective_date_article')!.touched;
    }

    get expirationDateField(): AbstractControl {
        return this.form.get('expiration_date_article')!;
    }

    get expirationDateIsValid(): boolean {
        return this.form.get('expiration_date_article')!.valid && this.form.get('expiration_date_article')!.touched;
    }

    get expirationDateIsInvalid(): boolean {
        return this.form.get('expiration_date_article')!.invalid && this.form.get('expiration_date_article')!.touched;
    }

    async updateOldRecord(article: any) {
        this.oldPlainData = {
            data: {
                id_article: article.id_article,
                id_asociation_article: article.id_asociation_article,
                id_user_article: article.id_user_article,
                category_article: article.category_article,
                subcategory_article: article.subcategory_article,
                class_article: article.class_article,
                state_article: article.state_article,
                publication_date_article: article.publication_date_article,
                effective_date_article: article.effective_date_article,
                expiration_date_article: article.expiration_date_article,
                title_article: article.title_article,
                abstract_article: article.abstract_article,
                ubication_article: article.ubication_article,
                date_updated_article: article.date_updated_article,
            },
            items: [],
        };

        this.oldImageData = {
            id_article: article.id_article,
            id_asociation_article: article.id_asociation_article,
            cover_image_article: article.cover_image_article,
            items_article: [],
            date_updated_article: article.date_updated_article,
        };

        article.items_article.map((item: IDataItemArticle, index: number) => {
            if (item.text_item_article !== '' || !item.image_item_article.isDefault) {
                this.oldPlainData.items.push({
                    id_item_article: index,
                    text_item_article: item.text_item_article,
                    is_default_image: item.image_item_article.isDefault,
                });
            }
            if (!item.image_item_article.isDefault) {
                this.oldImageData.items_article.push({
                    id_item_article: index,
                    image_item_article: item.image_item_article,
                });
            }
        });
    }
}
