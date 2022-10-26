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

    articleUrlDefault = environment.urlApi + '/assets/images/images.jpg';
    articleSrcDefault = environment.urlApi + '/assets/images/images.jpg';
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
        state_article: 'redaction',
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
        this.isSuper = this._usersService.userProfile.profile_user === 'superadmin' ? true : false;
        this.isAdmin = this._usersService.userProfile.id_asoc_admin === 0 ? false : true;

        if (!this.isSuper && !this.isAdmin) {
            // this._toastr.error('User not authorized to edit article', 'User not authorized to edit article');
            this.salirClick();
        }

        // this.article = {
        //     id_article: 1,
        //     id_asociation_article: 1,
        //     id_user_article: 2,
        //     category_article: 'categoria 1',
        //     subcategory_article: 'subcategoria 1',
        //     class_article: 'clase 1',
        //     state_article: 'redaction',
        //     publication_date_article: this.currentDate,
        //     effective_date_article: this.currentDate,
        //     expiration_date_article: '',
        //     cover_image_article: {
        //         src: this.articleSrcDefault,
        //         nameFile: '',
        //         filePath: '',
        //         fileImage: null,
        //         isSelectedFile: false,
        //         isDefault: this.articleSrcDefault === this.articleSrcDefault,
        //         isChange: false,
        //     },
        //     title_article: 'Artículo numero 1 de prueba',
        //     abstract_article: 'Abastract del Artículo numero 1 de prueba',
        //     items_article: [
        //         {
        //             image_item_article: {
        //                 src: this.articleSrcDefault,
        //                 nameFile: 'itemarticle1',
        //                 filePath: '',
        //                 fileImage: null,
        //                 isSelectedFile: false,
        //                 isDefault: this.articleSrcDefault === this.articleSrcDefault,
        //                 isChange: false,
        //             },
        //             text_item_article: 'Item n 1',
        //         },
        //         {
        //             image_item_article: {
        //                 src: this.articleSrcDefault,
        //                 nameFile: 'itemarticle1',
        //                 filePath: '',
        //                 fileImage: null,
        //                 isSelectedFile: false,
        //                 isDefault: this.articleSrcDefault === this.articleSrcDefault,
        //                 isChange: false,
        //             },
        //             text_item_article: 'Item n 2',
        //         },
        //     ],
        //     ubication_article: 'aqui',
        //     date_deleted_article: '2022-08-23 14:37:20',
        //     date_created_article: '2022-08-23 14:37:20',
        //     date_updated_article: '2022-08-23 14:37:20',
        // };

        this.form = this._formBuilder.group({
            cover_image_article: new FormControl({ value: '', disabled: false }),
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

    changeSizeRef(ref: any, size: number) {
        if (ref.value.length >= size) {
            ref.value = ref.value.substring(0, size);
            // return;
        }
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
        console.log(
            'Componente ' + this._name + ': save: this._usersService.userProfile.id_asoc_admin ─> ',
            this._usersService.userProfile.id_asoc_admin
        );

        // this.plainData.id_article = this.form.value.id_article;
        this.plainData = {
            data: {
                id_article: this.article.id_article,
                id_asociation_article:
                    this.article.id_asociation_article === 0 ? this._usersService.userProfile.id_asoc_admin : this.article.id_asociation_article,
                id_user_article: this._usersService.userProfile.id_user,
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
            if (item.text_item_article !== '' || !item.image_item_article.isDefault) {
                this.plainData.items.push({
                    id_item_article: index,
                    text_item_article: item.text_item_article,
                });
            }
            if (!item.image_item_article.isDefault) {
                ++numItems;
                this.imageData.items_article.push({
                    id_item_article: index,
                    image_item_article: item.image_item_article,
                });
            }
        });

        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.oldPlainData', '', this.oldPlainData);
        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.plainData', '', this.plainData);

        if (HelperClass.compareObj(this.oldPlainData, this.plainData) && HelperClass.compareObj(this.oldImageData, this.imageData)) {
            this._toastr.error('Nothing changed', 'Nothing changed');
            return;
        }

        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.imageData', '', this.imageData);
        let finish = { status: '', message: 'Unknown error' };

        switch (this.optionsDialog.id) {
            case 'create':
                finish = await this.createArticle();
                if (finish.status !== 'ok') {
                    this._toastr.error(finish.message, 'Error modifying article');
                    return;
                }

                break;

            case 'edit':
                if (!HelperClass.compareObj(this.oldPlainData, this.plainData)) {
                    finish = await this.modifyArticle();
                    if (finish.status !== 'ok') {
                        this._toastr.error(finish.message, 'Error modifying article');
                        return;
                    }
                }

                break;

            case 'delete':
                break;

            default:
                break;
        }

        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.oldImageData.cover_image_article', '', this.oldImageData.cover_image_article);
        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.imageData.cover_image_article', '', this.imageData.cover_image_article);
        if (this.oldImageData.cover_image_article !== this.imageData.cover_image_article) {
            HelperClass.consoleLog(this._log, this._name, 'save', '', 'actualize cover', '');
            const element = {
                cover: true,
                id_article: this.articleResp.data.id_article,
                id_asociation_article: this._usersService.userProfile.id_asoc_admin,
                cover_image_article: this.form.value.cover_image_article,
            };
            const respCover = await this.uploadImage(element);
            if (respCover.status !== 'ok') {
                this._toastr.error(respCover.message, 'Error load cover image');
                return;
            }
        }

        let respItemImage = { status: '', message: '' };
        for (let index = 0; index < this.imageData.items_article.length; index++) {
            HelperClass.consoleLog(this._log, this._name, 'save', '', 'actualize item image', '', index);
            const element = {
                cover: false,
                id_article: this.articleResp.data.id_article,
                id_item_article: this.imageData.items_article[index].id_item_article,
                image_item_article: this.imageData.items_article[index].image_item_article,
            };

            respItemImage = await this.uploadImage(element, index + 1, numItems);
            if (respItemImage.status !== 'ok') {
                this._toastr.error(respItemImage.message, 'Error load image item image' + index.toString());
                return;
            }
        }

        HelperClass.consoleLog(this._log, this._name, 'save', '', 'this.articleResp', '', this.articleResp);
        this.exitForm(this.articleResp);
    }

    async previewClick() {
        if (!this.form.valid) {
            this.form.markAllAsTouched;
            this._toastr.error('Fields are required', 'Fill fields for preview, please');
            return;
        }

        const articlePreview = this.form.value;
        articlePreview['user'] = {
            id_user: this._usersService.userProfile.id_user,
            name_user: this._usersService.userProfile.name_user,
            last_name_user: this._usersService.userProfile.last_name_user,
            profile_user: this._usersService.userProfile.profile_user,
            avatar_user: this._usersService.userProfile.avatar_user,
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
                this._articlesService.modifyArticle(this.plainData).subscribe({
                    next: async (resp: any) => {
                        console.log('Componente ' + this._name + ': modifyArticle: resp ─> ', resp);
                        if (resp.status === 200) {
                            this.articleResp.data = resp.result;
                            console.log('Componente ' + this._name + ': modifyArticle: this.articleResp ─> ', this.articleResp);
                            resolve({ status: 'ok', message: 'El usuario se modificó con exito' });
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
            const asoc = this._usersService.userProfile.id_asoc_admin === 0 ? '9'.repeat(9) : this._usersService.userProfile.id_asoc_admin;
            console.log('Componente ' + this._name + ': uploadImage: image ─> ', image);
            const fd = new FormData();
            fd.append('action', 'upload');
            fd.append('module', 'articles');
            fd.append('user_id', image.id_article.toString());
            fd.append('token', this._usersService.userProfile.token_user);
            if (image.cover) {
                fd.append('cover', 'cover');
                fd.append('id_article', image.id_article.toString());
                fd.append('id_asociation_article', image.id_asociation_article.toString());
                fd.append('name', 'cover.png');
                fd.append('prefix', 'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/cover');
                fd.append('file', image.cover_image_article.fileImage, 'cover.png');
            } else {
                fd.append('cover', 'item');
                fd.append('id_item_article', image.id_item_article.toString());
                fd.append('index', index.toString());
                fd.append('items', items.toString());
                fd.append('id_article_item_article', image.id_article.toString());
                fd.append('name', 'item-' + image.id_item_article + '.png');
                fd.append('prefix', 'images' + '/asociation-' + asoc + '/article-' + image.id_article.toString() + '/items-images');
                fd.append('is_new', image.image_item_article.isSelectedFile ? 'true' : 'false');
                if (image.image_item_article.isSelectedFile) {
                    fd.append('file', image.image_item_article.fileImage, 'item-' + image.id_item_article + '.png');
                } else {
                    fd.append('file_src', image.image_item_article.src);
                }
            }
            fd.append('date_updated', this.articleResp.data.date_updated_article);
            // fd.append('name', this.logoImg.nameFile);
            // if (this.logoImg.fileImage !== null) {
            // }
            let observable: Observable<any>;

            if (items > 0) {
                observable = this._articlesService.uploadImageItem(fd);
            } else {
                observable = this._articlesService.uploadImage(fd);
            }
            // this._articlesService.uploadImage(fd).subscribe({
            const subscription: Subscription = observable.subscribe({
                next: (event: any) => {
                    console.log('Componente ' + this._name + ': uploadImages: event ─> ', event);
                    if (event.type === HttpEventType.UploadProgress) {
                        console.log(
                            'Componente ' + this._name + ': uploadImages: Upload progress ─> ',
                            event.total ? Math.round(event.loaded / event.total) * 100 + ' %' : '--'
                        );
                    } else if (event.type === HttpEventType.Response) {
                        console.log('Componente ' + this._name + ': uploadImages: response event ─> ', event);
                        this.articleResp.data = event.body.result;
                        subscription.unsubscribe();
                        if (event.body.message === 'ok') {
                            console.log('Componente ' + this._name + ': uploadImage: ok ─> ', event);
                            resolve({ status: 'ok', message: 'Logo deleted successfully' });
                        } else {
                            console.log('Componente ' + this._name + ': uploadImage: error ─> ', event.message, event.code);
                            resolve({ status: 'error', message: event.body.message });
                        }
                    }
                },
                error: (err: any) => {
                    console.log('Componente ' + this._name + ': uploadImages: error ─> ', err);
                    subscription.unsubscribe();
                    resolve({ status: 'error', message: err.error });
                },
                complete: () => {
                    console.log('Componente ' + this._name + ': uploadImages: complete ─> post uploadImages');
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
}
